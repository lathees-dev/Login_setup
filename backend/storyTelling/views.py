from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
import logging
from django.core.files.base import ContentFile
import base64
import speech_recognition as sr
from pydub import AudioSegment
import io
import random
from .models import StoryTest
from rest_framework.permissions import AllowAny

# Set up logging
logger = logging.getLogger(__name__)

# Configure Google API
os.environ["GOOGLE_API_KEY"] = "AIzaSyBnAuc3Ooydn6lvbL9Ijpy8TDJuRxXZXyA"

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0.7,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# Test situations
SITUATIONS = [
    {
        "id": 1,
        "description": "You are lost in a forest. Describe your surroundings and how you plan to find your way out."
    },
    {
        "id": 2,
        "description": "You wake up in a strange room with no memory of how you got there. Describe your thoughts and actions."
    },
    {
        "id": 3,
        "description": "You are on a spaceship that is about to crash. Describe your final moments and thoughts."
    }
]

def chat_with_bot(user_input):
    try:
        system_prompt = """You are a friendly storytelling assistant. Your role is to:
        1. For scenarios: Provide a brief, clear scenario in 2-3 sentences maximum. No asterisks or special formatting.
        2. For feedback: Analyze the story based on key storytelling elements and provide concise feedback.
        3. When analyzing stories, first verify if the story matches the given scenario.

        When analyzing stories, evaluate these aspects in order:
        1. Scenario Alignment:
           - Does the story follow the given scenario?
           - Are the main elements from the scenario present?

        2. If the story matches the scenario, evaluate:
           - Story Structure (beginning, middle, end)
           - Character Development
           - Plot and Conflict
           - Descriptive Elements
           - Emotional Impact
           - Language and Flow
        
        Keep responses brief but specific."""

        # If it's a request for a scenario
        if "provide a scenario" in user_input.lower():
            prompt = "Generate a brief, engaging storytelling scenario in 2-3 sentences."
        else:
            prompt = """Analyze the following story and provide feedback in this format:

            Scenario Alignment:
            • Brief note on how well the story matches the given scenario

            Key Strengths (2-3 points):
            • Focus on the best elements from: story structure, character development, descriptions, emotional impact
            
            Areas for Growth (2-3 points):
            • Specific suggestions for improvement in: plot development, pacing, descriptions, or character depth
            
            Technical Elements:
            • Comment on: grammar, vocabulary, and sentence structure (1-2 points)
            
            Overall Impact:
            • Brief comment on the story's emotional resonance and originality
            
            Professional Tips:
            • 2-3 specific tips to improve storytelling skills

            Note: If the story doesn't match the scenario, only provide feedback about scenario alignment and what elements are missing.
            Keep each section concise with 1-2 lines per point."""

        user_message = f"User's message: {user_input}"
        
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", user_message),
        ])

        chain = prompt_template | llm
        response = chain.invoke({"prompt": user_message})
        
        # Clean up the response
        content = response.content if hasattr(response, 'content') else str(response)
        content = content.replace('*', '•').replace('\n\n\n', '\n\n')
        
        # Additional formatting cleanup
        content = content.replace('Scenario Alignment:', '\nScenario Alignment:')
        content = content.replace('Key Strengths:', '\nKey Strengths:')
        content = content.replace('Areas for Growth:', '\nAreas for Growth:')
        content = content.replace('Technical Elements:', '\nTechnical Elements:')
        content = content.replace('Overall Impact:', '\nOverall Impact:')
        content = content.replace('Professional Tips:', '\nProfessional Tips:')
        
        return content

    except Exception as e:
        logger.error(f"Error in chat interaction: {str(e)}")
        return "I apologize, but I'm having trouble processing that right now. Please try again."

@api_view(['POST'])
def story_feedback(request):
    story = request.data.get('story', '')
    feedback = analyze_story(story)
    return Response({'feedback': feedback})

@api_view(['POST'])
def chat_with_assistant(request):
    user_input = request.data.get('message', '')
    response = chat_with_bot(user_input)
    return Response({'response': response})

def analyze_story(situation, text):
    """Analyze story using LLM and return score"""
    try:
        prompt = f"""Analyze this storytelling test response:
        
        Situation: {situation}
        Response: {text}
        
        Score the response out of 100 based on:
        1. Creativity and imagination (30 points)
        2. Relevance to situation (30 points)
        3. Story structure and coherence (20 points)
        4. Language and expression (20 points)
        
        Return only the final numeric score."""
        
        response = chat_with_bot(prompt)
        try:
            score = int(response.strip())
            return min(max(score, 0), 100)  # Ensure score is between 0 and 100
        except ValueError:
            logger.error(f"Invalid score format from LLM: {response}")
            return 50  # Default score
            
    except Exception as e:
        logger.error(f"Error analyzing story: {str(e)}")
        return 50  # Default score

@api_view(['GET'])
@permission_classes([AllowAny])
def get_test_situation(request):
    """Get a random test situation"""
    situation = random.choice(SITUATIONS)
    return Response(situation)

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_test(request):
    """Submit a test response"""
    try:
        situation_id = request.data.get('situationId')
        audio_data = request.data.get('audioData')  # Base64 encoded audio
        
        if not audio_data or not situation_id:
            return Response({'error': 'Missing required data'}, status=400)

        try:
            # Clean up the base64 string
            if ',' in audio_data:
                audio_data = audio_data.split(',')[1]
                
            # Convert base64 to audio bytes
            audio_bytes = base64.b64decode(audio_data)
            
            # Create a temporary WAV file
            with io.BytesIO() as wav_buffer:
                # Convert audio to WAV format using pydub
                try:
                    audio_segment = AudioSegment.from_file(
                        io.BytesIO(audio_bytes),
                        format="webm"  # Specify the input format
                    )
                    audio_segment.export(wav_buffer, format='wav')
                    wav_buffer.seek(0)
                    
                    # Convert to text
                    text = convert_audio_to_text(wav_buffer.read())
                    
                    if not text:
                        return Response({'error': 'Failed to convert audio to text'}, status=400)
                    
                    # Create test response with the WAV file
                    wav_buffer.seek(0)  # Reset buffer position
                    test = StoryTest(
                        user=request.user if request.user.is_authenticated else None,
                        situation_id=situation_id,
                        audio_file=ContentFile(wav_buffer.read(), name='test_audio.wav')
                    )
                    
                except Exception as e:
                    logger.error(f"Error processing audio: {str(e)}")
                    return Response({'error': 'Error processing audio file'}, status=400)
                
                # Get score from LLM
                situation = next((s for s in SITUATIONS if s['id'] == int(situation_id)), None)
                if not situation:
                    return Response({'error': 'Invalid situation ID'}, status=400)
                    
                score = analyze_story(situation['description'], text)
                test.score = score
                test.save()
                
                return Response({
                    'score': score,
                    'transcription': text
                })
                
        except Exception as e:
            logger.error(f"Error processing request data: {str(e)}")
            return Response({'error': 'Error processing request data'}, status=400)
            
    except Exception as e:
        logger.error(f"Error in submit_test: {str(e)}")
        return Response({'error': str(e)}, status=500)

def convert_audio_to_text(audio_bytes):
    """Convert audio to text using speech recognition"""
    try:
        # Create a BytesIO object from the audio bytes
        audio_data = io.BytesIO(audio_bytes)
        
        # Use recognizer directly with the audio data
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_data) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            return text
            
    except Exception as e:
        logger.error(f"Error converting audio to text: {str(e)}")
        return None

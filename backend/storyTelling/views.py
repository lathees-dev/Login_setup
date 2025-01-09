from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Configure Google API
os.environ["GOOGLE_API_KEY"] = "AIzaSyBQhTgdeffYLYsH726KgHtvtF0i1YLjQ80"

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0.7,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

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

def analyze_story(story):
    try:
        prompt = (
            "Analyze the following story and provide feedback on its structure, "
            "creativity, and engagement. Offer suggestions for improvement:\n"
            f"{story}"
        )
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant that provides feedback on storytelling."),
            ("human", "{prompt}"),
        ])
        chain = prompt_template | llm
        response = chain.invoke({"prompt": prompt})
        return response.content if hasattr(response, 'content') else str(response)
    except Exception as e:
        return f"Error in analyzing story: {str(e)}"

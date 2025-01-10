from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
import logging

logger = logging.getLogger(__name__)

os.environ["GOOGLE_API_KEY"] = "AIzaSyBQhTgdeffYLYsH726KgHtvtF0i1YLjQ80"

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# Create your views here.

@api_view(['GET'])
def get_vocabulary_options(request):
    options = [
        {'title': 'Learn', 'path': '/vocabulary/learn'},
        {'title': 'Practice', 'path': '/vocabulary/practice'},
        {'title': 'Test', 'path': '/vocabulary/test'},
    ]
    return Response(options)

@api_view(['GET'])
def generate_vocabulary_question(request):
    prompt = """
    Act as an English teacher. Generate a multiple-choice question to test vocabulary knowledge.
    Provide a sentence with a missing word and multiple options, ensuring the correct answer is a commonly used word in English vocabulary.
    Generate a question in the below JSON format:
    {{
        "sentence": "The chef prepared a _____ meal for the guests.",
        "options": ["delicious", "happy", "angry", "unprepared"],
        "correct_answer": "delicious",
        "explanation": "Delicious is an adjective used to refer to a very tasty meal."
    }}
    """

    try:
        prompt_template = ChatPromptTemplate.from_messages(
            [
                ("system", "You are a helpful assistant that helps in generating a question with the corresponding format."),
                ("human", prompt),
            ]
        )
        chain = prompt_template | llm
        response = chain.invoke({"prompt": prompt})
        raw_response = response.content.strip()

        logger.info("Raw Response: %s", raw_response)

        # Clean up improper quotes in the JSON
        cleaned_response = re.sub(r'#.*', '', raw_response).strip()
        cleaned_response = re.sub(r'```json', '', cleaned_response).strip()
        cleaned_response = re.sub(r'```', '', cleaned_response).strip()
        cleaned_response = re.sub(r'(?<!\\)"(.*?)"(?![:,])', r'"\1"', cleaned_response)
        cleaned_response = cleaned_response.replace('*', '').strip()
        cleaned_response = cleaned_response.replace('""', '"').strip()

        # Parse JSON
        question_data = json.loads(cleaned_response)

        # Validate the structure
        if not all(key in question_data for key in ("sentence", "options", "correct_answer")):
            logger.error("Invalid response structure: %s", question_data)
            return Response({"error": "Invalid response structure"}, status=400)

        return Response(question_data)

    except json.JSONDecodeError as e:
        logger.error("JSON Decode Error: %s", e)
        return Response({"error": "Error parsing response as JSON"}, status=500)
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        return Response({"error": str(e)}, status=500)
    
@api_view(['GET'])
def generate_vocabulary_test(request):
       questions = []
       for _ in range(15):  # Generate 15 questions
           prompt = """
           Act as an English teacher. Generate a multiple-choice question to test vocabulary knowledge.
           Provide a sentence with a missing word and multiple options, ensuring the correct answer is a commonly used word in English vocabulary.
           Generate a question in the below JSON format:
           {
               "sentence": "The chef prepared a _____ meal for the guests.",
               "options": ["delicious", "happy", "angry", "unprepared"],
               "correct_answer": "delicious",
               "explanation": "Delicious is an adjective used to refer to a very tasty meal."
           }
           """
           try:
               prompt_template = ChatPromptTemplate.from_messages(
                   [
                       ("system", "You are a helpful assistant that helps in generating a question with the corresponding format."),
                       ("human", prompt),
                   ]
               )
               chain = prompt_template | llm
               response = chain.invoke({"prompt": prompt})
               raw_response = response.content.strip()

               # Clean up improper quotes in the JSON
               cleaned_response = re.sub(r'#.*', '', raw_response).strip()
               cleaned_response = re.sub(r'```json', '', cleaned_response).strip()
               cleaned_response = re.sub(r'```', '', cleaned_response).strip()
               cleaned_response = re.sub(r'(?<!\\)"(.*?)"(?![:,])', r'"\1"', cleaned_response)
               cleaned_response = cleaned_response.replace('*', '').strip()
               cleaned_response = cleaned_response.replace('""', '"').strip()

               # Parse JSON
               question_data = json.loads(cleaned_response)

               # Validate the structure
               if not all(key in question_data for key in ("sentence", "options", "correct_answer")):
                   logger.error("Invalid response structure: %s", question_data)
                   return Response({"error": "Invalid response structure"}, status=400)

               questions.append(question_data)

           except Exception as e:
               logger.error("Error generating question: %s", e)
               return Response({"error": "Error generating questions"}, status=500)

       return Response(questions)
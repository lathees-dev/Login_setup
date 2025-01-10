from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(['GET'])
def get_grammar_options(request):
    options = [
        {'title': 'Learn', 'path': '/grammar/learn'},
        {'title': 'Practice', 'path': '/grammar/practice'},
        {'title': 'Test', 'path': '/grammar/test'},
    ]
    return Response(options)

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(['GET'])
def get_communication_options(request):
    options = [
        {'title': 'Learn', 'path': '/communication/learn'},
        {'title': 'Practice', 'path': '/communication/practice'},
        {'title': 'Test', 'path': '/communication/test'},
    ]
    return Response(options)

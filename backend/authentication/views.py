from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
User = get_user_model()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class HomeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page.'}

        return Response(content)
    
class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Logout error: ", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
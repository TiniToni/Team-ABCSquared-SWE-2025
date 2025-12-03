# quizzes/serializers.py
from rest_framework import serializers
from .models import Quiz, Question, Choice, QuizSubmission, Unit1

# serializers for quiz models
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text']  

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions']

class QuizSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizSubmission
        fields = ['id', 'quiz', 'user', 'score', 'submitted_at']
        read_only_fields = ['user', 'score', 'submitted_at']

class Unit1Serializer(serializers.ModelSerializer):
    # returns list of completed lessons for progress tracking (frontend)
    lessons_completed = serializers.SerializerMethodField()
    
    class Meta:
        model = Unit1
        fields = ['id', 'unit_name', 'unit_code', 'lesson1_completed', 'lesson2_completed', 
                  'lesson3_completed', 'lesson4_completed', 'lesson5_completed', 
                  'lesson6_completed', 'lesson7_completed', 'lesson8_completed', 
                  'lesson9_completed', 'lessons_completed']
        read_only_fields = ['id', 'unit_name', 'unit_code']
    
    def get_lessons_completed(self, obj):
        completed = []
        for i in range(1, 10):
            field_name = f'lesson{i}_completed'
            if getattr(obj, field_name, False):
                completed.append(i)
        return completed
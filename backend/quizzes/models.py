from django.db import models

# Create your models here.
from django.conf import settings

class userProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    creature = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.progress}%"

from django.conf import settings

class Unit1(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    unit_name = models.CharField(max_length=100)
    unit_code = models.CharField(max_length=20)
    
    # ADD THESE LESSON FIELDS:
    lesson1_completed = models.BooleanField(default=False)
    lesson2_completed = models.BooleanField(default=False)
    lesson3_completed = models.BooleanField(default=False)
    lesson4_completed = models.BooleanField(default=False)
    lesson5_completed = models.BooleanField(default=False)
    lesson6_completed = models.BooleanField(default=False)
    lesson7_completed = models.BooleanField(default=False)
    lesson8_completed = models.BooleanField(default=False)
    lesson9_completed = models.BooleanField(default=False)
    
    class Meta:
        # Ensure each user has only one Unit1 record per unit_code
        unique_together = ('user', 'unit_code')
    
    def __str__(self):
        return f"{self.user.username} - {self.unit_name}"
    
    # Optional: Add a property to get completed lessons
    @property
    def completed_lessons(self):
        completed = []
        for i in range(1, 10):
            if getattr(self, f'lesson{i}_completed', False):
                completed.append(i)
        return completed

    def __str__(self):
        return self.unit_name
    
class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

# models.py - Update QuizSubmission model
class QuizSubmission(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    score = models.IntegerField()
    num_questions = models.IntegerField(default=0)  # Add this field
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.score}/{self.num_questions}"
class LessonQuizMapping(models.Model):
    """Maps quizzes to units and lessons (e.g., Quiz 1 = Unit 1 Lesson 1)"""
    quiz = models.OneToOneField(Quiz, on_delete=models.CASCADE)
    unit = models.IntegerField(default=1)  # which unit (1, 2, 3, etc.)
    lesson = models.IntegerField(default=1)  # which lesson within the unit (1-9)
    
    class Meta:
        unique_together = ('unit', 'lesson')
    
    def __str__(self):
        return f"Unit {self.unit} - Lesson {self.lesson}: {self.quiz.title}"
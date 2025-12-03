from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

class userProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    creature = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.progress}%"

class Unit1(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    unit_name = models.CharField(max_length=100)
    unit_code = models.CharField(max_length=20, unique=True)
    lesson1_completed = models.BooleanField(default=False)
    lesson2_completed = models.BooleanField(default=False)
    lesson3_completed = models.BooleanField(default=False)
    lesson4_completed = models.BooleanField(default=False)
    lesson5_completed = models.BooleanField(default=False)
    lesson6_completed = models.BooleanField(default=False)
    lesson7_completed = models.BooleanField(default=False)
    lesson8_completed = models.BooleanField(default=False)
    lesson9_completed = models.BooleanField(default=False)

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

class QuizSubmission(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    score = models.IntegerField()
    submitted_at = models.DateTimeField(auto_now_add=True)
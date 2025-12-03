from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(userProgress)
admin.site.register(Unit1)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(QuizSubmission)
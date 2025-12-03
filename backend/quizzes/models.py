from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
   
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
from django.db.models.fields import CharField
from rest_framework import serializers
from rest_framework import validators
from rest_framework.validators import UniqueTogetherValidator


from .models import Habit


class HabitSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Habit
        fields = ['id', 'title', 'ritual',
                  'description', 'created_at', 'updated_at', 'slug']

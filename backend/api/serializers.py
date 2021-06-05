from rest_framework import serializers

from .models import Habit

class HabitSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Habit
        fields = ['title', 'ritual', 'description', 'created_at', 'updated_at']

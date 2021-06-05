from django.db.models.fields import CharField
from rest_framework import serializers
from rest_framework import validators
from rest_framework.validators import UniqueTogetherValidator


from .models import Habit

class HabitSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = Habit
        fields = ['id', 'user_id', 'title', 'ritual', 'description', 'created_at', 'updated_at']
        validators = [
            UniqueTogetherValidator(
                queryset=Habit.objects.all(),
                fields=['title', 'user_id'],message='The habit title field must be unique.'
            )
        ]
    def validate_user_id(self, value):
        if not value == self.context['request'].user.username:
            raise serializers.ValidationError('The user_id field is invalid.')
        return value
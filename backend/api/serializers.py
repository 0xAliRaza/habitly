from enum import unique
from django.db.models import fields
from django.db.models.fields import CharField
from rest_framework import serializers
from rest_framework import validators
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.validators import UniqueTogetherValidator


from .models import Habit, Stack


class HabitSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Habit
        fields = ['id', 'title', 'ritual',
                  'description', 'created_at', 'updated_at', 'slug', 'type']


class StackSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField('get_request_user_id')

    def get_request_user_id(self, obj):
        return self.context.get('request').user.username

    def validate(self, attrs):
        user_id = self.context.get('request').user.username
        # Check if stack already exists
        try:
            obj = Stack.objects.get(user_id=user_id,
                                    first_habit=attrs['first_habit'], second_habit=attrs['second_habit'])
        except Stack.DoesNotExist:
            pass
        else:
            raise serializers.ValidationError({'Stack': [
                'Model with given habits already exists.']})

        # Check if stack exists in the reverse order
        try:
            obj_reversed = Stack.objects.get(
                user_id=user_id, first_habit=attrs['second_habit'], second_habit=attrs['first_habit'])
        except Stack.DoesNotExist:
            pass
        else:
            raise serializers.ValidationError({'Stack': [
                'Model with given habits already exists.']})

        # Validate if first_habit model is owned by the current user
        if attrs['first_habit'].user_id != user_id:
            raise serializers.ValidationError({'first_habit': [
                'Model was not found.']})
        # Validate if habit models is owned by the current user
        if attrs['second_habit'].user_id != user_id:
            raise serializers.ValidationError({'second_habit': [
                'Model was not found.']})
        else:
            return attrs

    class Meta:
        model = Stack
        fields = ['id', 'user_id', 'first_habit', 'second_habit']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        del representation['user_id']
        return representation

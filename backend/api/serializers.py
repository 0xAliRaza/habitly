from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.validators import UniqueTogetherValidator
from datetime import datetime

from .models import Habit, Intention, Repetition, Stack


class HabitSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Habit
        fields = ['id', 'title', 'ritual',
                  'description', 'created_at', 'updated_at', 'slug', 'type']

    def to_representation(self, instance):

        try:
            todays_repetition = Repetition.objects.get(
                habit=instance, date=datetime.now().date())
        except Repetition.DoesNotExist:
            todays_repetition = None

        representation = super().to_representation(instance)
        repetitions_count = Repetition.objects.filter(habit=instance).count()
        if todays_repetition:
            representation['todays_repetition'] = {'id': todays_repetition.id, 'date': str(todays_repetition.date) + ' UTC', 'habit': {
                'id': instance.id, 'title': instance.title}}
        else:
            representation['todays_repetition'] = None
        representation['repetitions'] = repetitions_count
        return representation


class StackSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        user_id = self.context.get('request').user.username

        # Check if any habit is bad
        if attrs['current_habit'].type == 'B' or attrs['new_habit'].type == 'B':
            raise serializers.ValidationError({'Stack': [
                'Can\'t stack bad habit(s).']})

        # Check if both habits are the same
        if attrs['current_habit'].id == attrs['new_habit'].id:
            raise serializers.ValidationError({'Stack': [
                'Can\'t stack a habit with itself.']})

        # Check if stack already exists
        try:
            Stack.objects.get(user_id=user_id,
                              current_habit=attrs['current_habit'], new_habit=attrs['new_habit'])
        except Stack.DoesNotExist:
            pass
        else:
            raise serializers.ValidationError({'Stack': [
                'Model with given habits already exists.']})

        # Check if stack exists in the reverse order
        try:
            Stack.objects.get(
                user_id=user_id, current_habit=attrs['new_habit'], new_habit=attrs['current_habit'])
        except Stack.DoesNotExist:
            pass
        else:
            raise serializers.ValidationError({'Stack': [
                'Model with given habits already exists.']})

        # Check if current habit is already stacked
        try:
            Stack.objects.get(
                user_id=user_id, current_habit=attrs['current_habit'])
        except Stack.DoesNotExist:
            pass
        else:
            raise serializers.ValidationError(
                {'Stack': ['Current habit is already stacked with some other habit.']})

        # Check if new habit is already stacked
        try:
            Stack.objects.get(user_id=user_id, new_habit=attrs['new_habit'])
        except Stack.DoesNotExist:
            pass
        else:
            raise serializers.ValidationError(
                {'Stack': ['New habit is already stacked with some other habit.']})

        # Validate if current_habit model is owned by the current user
        if attrs['current_habit'].user_id != user_id:
            raise serializers.ValidationError({'Stack': [
                'Current habit was not found.']})

        # Validate if habit models is owned by the current user
        if attrs['new_habit'].user_id != user_id:
            raise serializers.ValidationError({'Stack': [
                'New habit was not found.']})
        else:
            return attrs

    class Meta:
        model = Stack
        fields = ['id', 'current_habit', 'new_habit']

    def to_representation(self, instance):

        representation = super().to_representation(instance)
        current_habit = instance.current_habit
        new_habit = instance.new_habit
        representation['current_habit'] = {
            "id": current_habit.id, "title": current_habit.title}
        representation['new_habit'] = {
            "id": new_habit.id, "title": new_habit.title}
        return representation


class IntentionSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        user_id = self.context.get('request').user.username

        # Validate if habit model is owned by the current user
        if attrs['habit'].user_id != user_id:
            raise serializers.ValidationError({'Intention': [
                'Habit was not found.']})

        # Verify if habit is good
        if attrs['habit'].type == 'B':
            raise serializers.ValidationError(
                {'Intention': ['Can\'t create intention for a bad habit.']})

        # Check if intention already exists
        try:
            Intention.objects.get(user_id=user_id,
                                  habit=attrs['habit'], time=attrs['time'], location=attrs['location'])
        except Intention.DoesNotExist:
            pass
        else:
            if not (self.instance and self.instance.id):
                raise serializers.ValidationError({'Intention': [
                    'Intention with the given fields already exists.']})
            else:
                pass

        # Check if given time is in the future
        if timezone.now() > attrs['time']:
            raise serializers.ValidationError(
                {'Intention': ['Intention time cannot be in the past.']})

        return attrs

    class Meta:
        model = Intention
        fields = ['id', 'habit', 'time', 'location', 'done']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        habit = instance.habit
        representation['habit'] = {
            "id": habit.id, "title": habit.title}
        return representation


class RepetitionSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        user_id = self.context.get('request').user.username

        # Validate if habit model is owned by the current user
        if attrs['habit'].user_id != user_id:
            raise serializers.ValidationError({'Repetition': [
                'Habit was not found.']})

        # Validate if repetition doesn't already exist
        try:
            Repetition.objects.get(habit=attrs['habit'], date=attrs['date'])
        except Repetition.DoesNotExist:
            pass
        else:
            raise serializers.ValidationError({'Repetition': [
                'Repetition with the given fields already exists.']})

        # Validate if given time is in the past
        if timezone.now().date() < attrs['date']:
            raise serializers.ValidationError(
                {'Repetition': ['Repetition date cannot be in the future.']})

        return attrs

    class Meta:
        model = Repetition
        fields = ['id', 'habit', 'date']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        habit = instance.habit
        representation['habit'] = {
            "id": habit.id, "title": habit.title}
        representation['date'] = representation['date'] + ' UTC'
        return representation

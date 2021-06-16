from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.validators import UniqueTogetherValidator


from .models import Habit, Intention, Stack


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
        fields = ['id', 'user_id', 'current_habit', 'new_habit']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        current_habit = Habit.objects.get(pk=representation['current_habit'])
        new_habit = Habit.objects.get(pk=representation['new_habit'])
        del representation['user_id']
        representation['current_habit'] = {
            "id": current_habit.id, "title": current_habit.title}
        representation['new_habit'] = {
            "id": new_habit.id, "title": new_habit.title}
        return representation


class IntentionSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField('get_request_user_id')

    def get_request_user_id(self, obj):
        return self.context.get('request').user.username

    def validate(self, attrs):
        user_id = self.context.get('request').user.username
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
                    'Model with given fields already exists.']})
            else:
                pass

        # Validate if habit model is owned by the current user
        if attrs['habit'].user_id != user_id:
            raise serializers.ValidationError({'Intention': [
                'Habit was not found.']})

        # Check if given time is in the future
        if timezone.now() > attrs['time']:
            raise serializers.ValidationError(
                {'Intention': ['Intention time cannot be in the past.']})

        return attrs

    class Meta:
        model = Intention
        fields = ['id', 'user_id', 'habit', 'time', 'location', 'done']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        habit = Habit.objects.get(pk=representation['habit'])
        del representation['user_id']
        representation['habit'] = {
            "id": habit.id, "title": habit.title}
        return representation

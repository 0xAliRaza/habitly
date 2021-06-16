from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.generics import CreateAPIView

from .serializers import HabitSerializer, IntentionSerializer, StackSerializer
from .models import Habit, Intention, Stack


def public(request):
    return HttpResponse("You don't need to be authenticated to see this")


@api_view(['GET'])
def private(request):
    return HttpResponse("You should not see this message if not authenticated!")


class HabitViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Habit.objects.filter(user_id=self.request.user.username)

    def perform_create(self, serializer):
        # Automatically append user_id from request
        return serializer.save(user_id=self.request.user.username)

    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]


class StackViewSet(viewsets.ModelViewSet):
    serializer_class = StackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.username
        return Stack.objects.filter(user_id=user_id, current_habit__user_id=user_id, new_habit__user_id=user_id)

    def perform_create(self, serializer):
        return serializer.save(user_id=self.request.user.username)


class IntentionViewSet(viewsets.ModelViewSet):
    serializer_class = IntentionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.username
        return Intention.objects.filter(user_id=user_id, habit__user_id=user_id)

    def perform_create(self, serializer):
        return serializer.save(user_id=self.request.user.username)

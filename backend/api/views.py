from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework import viewsets, permissions, mixins

from .serializers import HabitSerializer, IntentionSerializer, RepetitionSerializer, StackSerializer
from .models import Habit, Intention, Repetition, Stack


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
        serializer.save(user_id=self.request.user.username)

    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]


class StackViewSet(viewsets.ModelViewSet):
    serializer_class = StackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.username
        return Stack.objects.filter(user_id=user_id, current_habit__user_id=user_id, new_habit__user_id=user_id)

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.username)


class IntentionViewSet(viewsets.ModelViewSet):
    serializer_class = IntentionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.username
        queryset = Intention.objects.all()
        queryset = queryset.filter(user_id=user_id, habit__user_id=user_id)
        completed = self.request.query_params.get('completed')
        date = self.request.query_params.get('date')
        if completed:
            queryset = queryset.filter(done=True)
        else:
            queryset = queryset.filter(done=False)

        if date:
            queryset = queryset.filter(time__date=date)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.username)


class RepetitionViewSet(viewsets.ModelViewSet):
    serializer_class = RepetitionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.username
        queryset = Repetition.objects.all()
        queryset.filter(habit__user_id=user_id)
        habit = self.request.query_params.get('habit')
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        if habit:
            queryset = queryset.filter(habit=habit)

        if month and year:
            queryset = queryset.filter(
                date__month=month, date__year=year)
        elif year:
            queryset = queryset.filter(date__year=year)

        return queryset

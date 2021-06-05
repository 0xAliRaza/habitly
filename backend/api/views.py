from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework import viewsets, permissions

from .serializers import HabitSerializer
from .models import Habit


def public(request):
    return HttpResponse("You don't need to be authenticated to see this")


@api_view(['GET'])
def private(request):
    return HttpResponse("You should not see this message if not authenticated!")

class HabitViewSet(viewsets.ModelViewSet):
    queryset = Habit.objects.all().order_by('created_at')
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]
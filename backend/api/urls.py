from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'habits', views.HabitViewSet, basename='Habit')
router.register(r'stacks', views.StackViewSet, basename="Stack")
router.register(r'intentions', views.IntentionViewSet, basename="Intention")


urlpatterns = [
    path('', include(router.urls)),
    url(r'^public/', views.public),
    url(r'^private/', views.private),
]

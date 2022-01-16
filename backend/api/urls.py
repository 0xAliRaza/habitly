from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers
from django.conf import settings

from . import views

if settings.DEBUG:
	router = routers.DefaultRouter()
else:
	router = routers.SimpleRouter()

router.register(r'habits', views.HabitViewSet, basename='Habit')
router.register(r'stacks', views.StackViewSet, basename="Stack")
router.register(r'intentions', views.IntentionViewSet, basename="Intention")
router.register(r'repetitions', views.RepetitionViewSet, basename="Repetition")


urlpatterns = [
    path('', include(router.urls)),
    url(r'^/', views.public),
]

from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from . import views



router = routers.DefaultRouter()
router.register(r'habits', views.HabitViewSet, basename='Habit')


urlpatterns = [
    path('', include(router.urls)),
    url(r'^public/', views.public),
    url(r'^private/', views.private),
]
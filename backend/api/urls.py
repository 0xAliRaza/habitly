from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from . import views



router = routers.DefaultRouter()
router.register(r'habits', views.HabitViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    url(r'^api/public/', views.public),
    url(r'^api/private/', views.private),
]
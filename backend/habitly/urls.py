"""habitly URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    path(r'api/', include('api.urls')),
    path('', lambda request: HttpResponse("<h1 style='font-size: 24px; font-family: system-ui; padding: 20px; font-weight: 600; text-align: center;'>This is a live demo 🚀 of <a href='https://github.com/0xaliraza/habitly'>Habitly (backend)</a> coded with ❤️ by <a href='https://0xali.com/'>Ali Raza</a>.</h1>")),
]

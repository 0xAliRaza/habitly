from django.contrib import admin

from .models import Habit, Stack, Intention, Repetition

admin.site.register(Habit)

admin.site.register(Stack)

admin.site.register(Intention)

admin.site.register(Repetition)

from django.db import models
from django.utils.crypto import get_random_string
from django.utils.text import slugify


def unique_slugify(instance, slug):
    model = instance.__class__
    unique_slug = slug
    while model.objects.filter(slug=unique_slug).exists():
        unique_slug = slug + '-' + get_random_string(length=4)
    return unique_slug


class Habit(models.Model):
    user_id = models.CharField(max_length=50)
    title = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50, blank=True)
    ritual = models.CharField(max_length=50, blank=True)
    description = models.CharField(max_length=250, blank=True)
    type = models.CharField(max_length=1, choices=[
                            ('G', 'good'), ('B', 'bad')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, slugify(self.title))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        unique_together = ['user_id', 'slug']


class Stack(models.Model):
    user_id = models.CharField(max_length=50)
    first_habit = models.ForeignKey(
        Habit, on_delete=models.CASCADE, related_name='first_habit')
    second_habit = models.ForeignKey(
        Habit, on_delete=models.CASCADE, related_name='second_habit')

    class Meta:
        unique_together = ['user_id', 'first_habit', 'second_habit']

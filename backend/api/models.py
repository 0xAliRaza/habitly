from django.db import models

class Habit(models.Model):
    user_id = models.CharField(max_length=50)
    title = models.CharField(max_length=50)
    ritual = models.CharField(max_length=50, blank=True)
    description = models.CharField(max_length=250, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        unique_together = ['user_id', 'title']
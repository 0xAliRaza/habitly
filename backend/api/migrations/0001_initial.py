from django.db import migrations
from django.conf import settings

# Dummy user just to bypass db verification of rest_framework_jwt
def create_data(apps, schema_editor):
    User = apps.get_model(settings.AUTH_USER_MODEL)
    user = User(pk=1, username="auth0user", is_active=True , email="auth0user@example.com")
    user.save()


class Migration(migrations.Migration):
    dependencies = [
    ]
    operations = [
        migrations.RunPython(create_data),
    ]
# Generated by Django 3.2.3 on 2021-06-14 17:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_stack'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stack',
            name='first_habit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='first_habit', to='api.habit'),
        ),
        migrations.AlterField(
            model_name='stack',
            name='second_habit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='second_habit', to='api.habit'),
        ),
        migrations.AlterUniqueTogether(
            name='stack',
            unique_together={('user_id', 'first_habit', 'second_habit')},
        ),
    ]
# Generated by Django 3.2.3 on 2021-06-27 07:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_repetition_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='repetition',
            name='date',
            field=models.DateTimeField(),
        ),
    ]

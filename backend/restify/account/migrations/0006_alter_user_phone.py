# Generated by Django 4.1.7 on 2023-03-09 02:44

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0005_alter_user_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=models.CharField(blank=True, max_length=9, validators=[django.core.validators.RegexValidator('\\d{10}', message='Phone number must be 10 digits long and in the following format: 1234567890')], verbose_name='phone number'),
        ),
    ]

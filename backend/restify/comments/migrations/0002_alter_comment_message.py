# Generated by Django 4.1.7 on 2023-03-08 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='message',
            field=models.CharField(max_length=250),
        ),
    ]

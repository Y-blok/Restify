# Generated by Django 4.1.7 on 2023-03-09 02:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0003_comment_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='new',
            field=models.BooleanField(default=True),
        ),
    ]

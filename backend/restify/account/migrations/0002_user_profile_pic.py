# Generated by Django 4.1.7 on 2023-03-08 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_pic',
            field=models.ImageField(default='default.jpg', upload_to='profile'),
        ),
    ]

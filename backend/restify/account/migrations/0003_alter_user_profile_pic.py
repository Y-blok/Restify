# Generated by Django 4.1.7 on 2023-03-08 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_user_profile_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_pic',
            field=models.ImageField(default='profile/default.jpg', upload_to='profile'),
        ),
    ]

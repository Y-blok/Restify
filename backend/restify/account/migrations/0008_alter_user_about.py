# Generated by Django 4.1.7 on 2023-03-12 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0007_alter_user_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='about',
            field=models.CharField(blank=True, max_length=500, verbose_name='about'),
        ),
    ]
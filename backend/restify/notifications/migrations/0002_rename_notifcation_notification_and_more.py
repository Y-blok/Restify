# Generated by Django 4.1.7 on 2023-03-09 02:59

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Notifcation',
            new_name='Notification',
        ),
        migrations.RenameIndex(
            model_name='notification',
            new_name='notificatio_content_702c56_idx',
            old_name='notificatio_content_a3cd5b_idx',
        ),
    ]

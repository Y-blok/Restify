# Generated by Django 4.1.7 on 2023-03-10 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homes', '0005_alter_reservation_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='expiry_date',
            field=models.DateField(auto_now_add=True),
        ),
    ]

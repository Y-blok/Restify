# Generated by Django 4.1.7 on 2023-03-11 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homes', '0006_alter_reservation_expiry_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='images',
            name='alt',
            field=models.CharField(default='', max_length=50),
        ),
    ]

# Generated by Django 4.2.1 on 2023-11-08 08:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_alter_customuser_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='image',
            field=models.ImageField(default='backend/authentication/static/profileimage/profile.jpg', upload_to='profileimage'),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2019-06-15 17:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dash10', '0002_auto_20190615_2128'),
    ]

    operations = [
        migrations.CreateModel(
            name='userdbs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dbtype', models.CharField(max_length=250)),
                ('host', models.CharField(max_length=250)),
                ('port', models.CharField(max_length=250)),
                ('username', models.CharField(max_length=250)),
                ('passwd', models.CharField(max_length=250)),
                ('dbname', models.CharField(max_length=250)),
                ('email', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dash10.user')),
            ],
        ),
    ]
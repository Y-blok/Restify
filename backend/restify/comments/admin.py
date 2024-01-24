from django.contrib import admin
from .models import Comment, Response

# Register your models here.
admin.site.register(Comment)
admin.site.register(Response)
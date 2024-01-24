from django.contrib import admin
from .models import Home, Price, Images, Reservation

# Register your models here.
admin.site.register(Home)
admin.site.register(Price)
admin.site.register(Images)
admin.site.register(Reservation)
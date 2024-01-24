from django.urls import path
from . import views

app_name="notifications"

urlpatterns = [
    path('all/', views.NotifList.as_view(), name='list'),
    path('all/read/', views.ReadAllNotifs.as_view(), name='readall'),
    path('<slug:pk>/read/', views.ReadNotif.as_view(), name='read'),
    path('clear/', views.ClearNotifs.as_view(), name='clear'),
]
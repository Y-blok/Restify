from django.urls import path
from . import views

app_name="homes"

urlpatterns = [
    path('add/', views.HomeCreateView.as_view(), name = 'add'),

    path('search/', views.HomeSearchList.as_view(), name='search'),
    path('owned/', views.HomeOwnedList.as_view(), name='owned'),
    path('user/<slug:pk>/all/', views.HomeUserList.as_view(), name='user_homes'),

    path('<slug:pk>/edit/', views.HomeUpdateView.as_view(), name='edit'),
    path('<slug:pk>/details/', views.HomeDetailView.as_view(), name='detail'),
    path('<slug:pk>/delete/', views.DeleteHome.as_view(), name='delete'),
    path('<slug:pk>/add_review/', views.HomeCommentView.as_view(), name="homeReview"),

    path('<slug:pk>/reservations/add/', views.ReservationCreateView.as_view(), name='res-add'),
    path('<slug:pk>/reservations/<slug:res_pk>/edit_status/', views.ReservationEditStatusView.as_view(), name='res-edit'),
    path('<slug:pk>/reservations/<slug:res_pk>/cancel/', views.ReservationCancelView.as_view(), name='res-cancel'),
    path('<slug:pk>/reservations/<slug:res_pk>/details/', views.ReservationDetailView.as_view(), name="res-detail"),
    path('<slug:pk>/reservations/view/', views.ReservationListView.as_view(), name="res-list"),
    path('<slug:pk>/reservations/month_view/', views.ReservationMonthList.as_view(), name="res-mon-list"),

    path('<slug:pk>/availability/add/', views.CreateAvailability.as_view(), name="createAvail"),
    path('<slug:pk>/availability/<slug:avail_id>/update/', views.UpdateAvailability.as_view(), name="updateAvail"), 
    path('<slug:pk>/availability/<slug:avail_id>/delete/', views.DeleteAvailability.as_view(), name="deleteAvail"),
    path('<slug:pk>/availability/all/', views.ListAvail.as_view(), name='listAvail'),

    path('<slug:pk>/images/add/', views.AddImage.as_view(), name="addImage"),
    path('<slug:pk>/images/<slug:image_pk>/delete/', views.DeleteImage.as_view(), name="deleteImage"),  
    path('<slug:pk>/images/all/', views.ListImages.as_view(), name='listImages'),
]
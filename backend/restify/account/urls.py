from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views.reservations import UserReservationsList

app_name="account"

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', views.SignupView.as_view(), name="signup"),
    path('profile/details/', views.ProfileView.as_view(), name="profile"),
    path('profile/edit/', views.UpdateProfileView.as_view(), name="profile"),
    path('user/<slug:pk>/details/', views.UserRetrieveView.as_view(), name="user_profile"),
    path('user/<slug:pk>/add_comment/', views.UserCommentView.as_view(), name="user_profile"),
    path('reservations/', UserReservationsList.as_view(), name='reservations'),
]
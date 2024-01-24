from django.urls import path
from . import views

app_name="comments"

urlpatterns = [
    path('<slug:pk>/reply/', views.CreateReplyCommentView.as_view(), name="replyComment"),
    path('response/<slug:pk>/reply/', views.CreateReplyResponseView.as_view(), name="replyResponse"),
    path('<slug:pk>/update/', views.UpdateCommentView.as_view(), name="updateComment"),
    path('response/<slug:pk>/update/', views.UpdateResponseView.as_view(), name="updateResponse"),
    path('<slug:pk>/delete/', views.DeleteCommentView.as_view(), name="deleteComment"),
    path('response/<slug:pk>/delete/', views.DeleteResponseView.as_view(), name="deleteResponse"),
    path('user/<slug:pk>/all/', views.ListUserCommentView.as_view(), name="userComments"),
    path('home/<slug:pk>/all/', views.ListHomeCommentView.as_view(), name="homeComments"),
    path('<slug:pk>/all/', views.ListCommentResponsesView.as_view(), name="commentResponses"),
]
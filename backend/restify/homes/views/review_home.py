from django.shortcuts import get_object_or_404
from django.urls import reverse
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated, BasePermission
from notifications.models import Notification
from account.serializers import UserDetailSerializer
from account.models import User
from ..models import Home
from comments.models import Comment
from comments.serializers import CreateCommentSerializer
from homes.models import Reservation
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response as Resp
from rest_framework.serializers import ValidationError


class HasStayedUserPermission(BasePermission):
    message = 'You have not stayed at this home'

    def has_permission(self, request, view):
        for res in view.request.user.reserved_homes.all():
            hosted = Reservation.objects.filter(home=res.home, renter=request.user, status=7).first()
            if hosted:
                return True
            
        return False
    
class NoPrevHomeComPermission(BasePermission):
    message = 'You have already made a comment for this home'

    def has_permission(self, request, view):
        prev = Comment.objects.filter(content_type = ContentType.objects.get_for_model(Home), object_id = view.kwargs['pk'], comentee=request.user)
        if prev:
            raise ValidationError({"id": f"{prev.first().id}"})
        
        return True
    

class HomeCommentView(CreateAPIView):
    permission_classes = [IsAuthenticated, HasStayedUserPermission, NoPrevHomeComPermission, ]
    serializer_class = CreateCommentSerializer

    def perform_create(self, serializer):
        active = User.objects.get(id=self.request.user.id)
        home = get_object_or_404(Home, id=self.kwargs['pk'])
        serializer.save(
            comentee = active,
            comment_object = home
        )
        if 'rating' in self.request.data: 
            home.rating_sum += int(self.request.data['rating'])
        home.rating_number += 1
        
        Notification.objects.create(
            message = f"New comment on home {home.id}",
            notifee = home.owner,
            notif_link = self.request.build_absolute_uri(reverse("homes:detail", kwargs={"pk":home.id})),
            notification_object = home
            )

        home.save()

    def get_object(self):
        obj = get_object_or_404(Home, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get(self, request, *args, **kwargs):
        check = NoPrevHomeComPermission()
        if check.has_object_permission(request, self, self.get_object()):
            return Resp(status=200)
        return Resp(status=400)
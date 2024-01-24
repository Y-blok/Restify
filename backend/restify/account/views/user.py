from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated, BasePermission
from account.serializers import UserDetailSerializer
from account.models import User
from comments.models import Comment
from comments.serializers import CreateCommentSerializer
from homes.models import Reservation
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response as Resp
from rest_framework.serializers import ValidationError

class UserRetrieveView(RetrieveAPIView):
    serializer_class = UserDetailSerializer

    def get_object(self):
        return get_object_or_404(User, id=self.kwargs['pk'])
    


class HasHostedUserPermission(BasePermission):
    message = 'You have not hosted this user'

    def has_permission(self, request, view):
        user = get_object_or_404(User, id=view.kwargs['pk']) 
        for home in view.request.user.owned_homes.all():
            hosted = Reservation.objects.filter(home=home, renter=user, status=7).first()
            if hosted:
                return True
            
        return False
    
class NoPrevUserComPermission(BasePermission):
    message = 'You have already made a comment for this user'

    def has_permission(self, request, view):
        prev = Comment.objects.filter(content_type = ContentType.objects.get_for_model(User), object_id = view.kwargs['pk'], comentee=request.user)
        if prev:
            raise ValidationError({"id": f"{prev.first().id}"})
        
        return True
    

class UserCommentView(CreateAPIView):
    permission_classes = [IsAuthenticated, HasHostedUserPermission, NoPrevUserComPermission, ]
    serializer_class = CreateCommentSerializer

    def perform_create(self, serializer):
        active = User.objects.get(id=self.request.user.id)
        user = get_object_or_404(User, id=self.kwargs['pk'])
        serializer.save(
            comentee = active,
            comment_object = user
        )
        user.rating_sum += int(self.request.data['rating'])
        user.rating_number += 1
        
        user.save()
        
    def get_object(self):
        obj = get_object_or_404(User, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get(self, request, *args, **kwargs):
        check = NoPrevUserComPermission()
        if check.has_object_permission(request, self, self.get_object()):
            return Resp(status=200)
        return Resp(status=400)
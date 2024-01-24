from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView, ListAPIView

from account.models import User
from .serializers import CreateResponseSerializer, CreateCommentSerializer, CommentSerializer, ResponseSerializer
from .models import Comment, Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from homes.models import Home
from rest_framework.pagination import PageNumberPagination
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response as Resp


### CREATION VIEWS ###

class IsOwnedHomeComment(BasePermission):
    message = 'This comment was not about a property you own'

    def has_object_permission(self, request, view, obj):
        
        if type(obj.comment_object) != Home:
            return False
        
        if obj.comment_object.owner != request.user:
            return False
        
        return True
    
class NoPreviousCommentReply(BasePermission):
    message = 'You have already responded to this comment'

    def has_permission(self, request, view):
        if Response.objects.filter(content_type = ContentType.objects.get_for_model(Comment), object_id = view.kwargs['pk'], comentee=request.user):
            return False
        
        return True

class CreateReplyCommentView(CreateAPIView):
    serializer_class = CreateResponseSerializer
    permission_classes = [IsAuthenticated, IsOwnedHomeComment, NoPreviousCommentReply]

    def perform_create(self, serializer):
        com = self.get_object()
        serializer.save(
            response_object = com,
            comment = com,
            comentee = self.request.user,
            level = 0
        )

    def get_object(self):
        obj = get_object_or_404(Comment, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get(self, request, *args, **kwargs):
        check = IsOwnedHomeComment()
        if check.has_object_permission(request, self, self.get_object()):
            return Resp(status=200)
        return Resp(status=400)
    
class NoPreviousResponseReply(BasePermission):
    message = 'You have already responded to this response'

    def has_permission(self, request, view):
        if Response.objects.filter(content_type = ContentType.objects.get_for_model(Response), object_id = view.kwargs['pk'], comentee=request.user):
            return False
        
        return True

class IsResponseToUser(BasePermission):
    message = 'This response was not in response to you'

    def has_object_permission(self, request, view, obj):

        if obj.response_object.comentee != request.user:
            return False
        
        return True

class CreateReplyResponseView(CreateAPIView):
    serializer_class = CreateResponseSerializer
    permission_classes = [IsAuthenticated, IsResponseToUser, NoPreviousResponseReply]

    def perform_create(self, serializer):
        com = self.get_object()
        serializer.save(
            response_object = com,
            comment = com.comment,
            comentee = self.request.user,
            level = com.level + 1
        )

    def get_object(self):
        obj = get_object_or_404(Response, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get(self, request, *args, **kwargs):
        check = IsResponseToUser()
        if check.has_object_permission(request, self, self.get_object()):
            return Resp(status=200)
        return Resp(status=400)
    


### UPDATE VIEWS ###

class IsCommentOwner(BasePermission):
    message = 'This comment is not yours to update'

    def has_object_permission(self, request, view, obj):

        if obj.comentee != request.user:
            return False
        
        return True

class UpdateCommentView(UpdateAPIView):
    serializer_class = CreateCommentSerializer
    permission_classes = [IsAuthenticated, IsCommentOwner]
    
    def perform_update(self, serializer):
        comment = self.get_object()
        comment.comment_object.rating_sum -= comment.rating
        comment.comment_object.rating_number -= 1
        comment.comment_object.save()

        serializer.save()

        comment = self.get_object()
        comment.comment_object.rating_sum += comment.rating
        comment.comment_object.rating_number += 1
        comment.comment_object.save()
        

    def get_object(self):
        obj = get_object_or_404(Comment, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj


class IsResponseOwner(BasePermission):
    message = 'This response is not yours to update'

    def has_object_permission(self, request, view, obj):

        if obj.comentee != request.user:
            return False
        
        return True

class UpdateResponseView(UpdateAPIView):
    serializer_class = CreateResponseSerializer
    permission_classes = [IsAuthenticated, IsResponseOwner]

    def get_object(self):
        obj = get_object_or_404(Response, id=self.kwargs['pk'])  
        self.check_object_permissions(self.request, obj)
        return obj
    


### DELETE COMMENT VIEWS ###

class DeleteCommentView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsCommentOwner]
    
    def get_object(self):
        obj = get_object_or_404(Comment, id=self.kwargs['pk']) 
        self.check_object_permissions(self.request, obj)
        return obj


class DeleteResponseView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsResponseOwner]

    def get_object(self):
        obj = get_object_or_404(Response, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    


##### VIEW COMMENTS VIEWS ###########

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50


class ListUserCommentView(ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user = get_object_or_404(User, id=self.kwargs['pk'])
        return user.comments.all()


class ListHomeCommentView(ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        home = get_object_or_404(Home, id=self.kwargs['pk'])
        return home.comments.all().order_by('datetime')
    

class ListCommentResponsesView(ListAPIView):
    serializer_class = ResponseSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        comment = get_object_or_404(Comment, id=self.kwargs['pk'])
        return Response.objects.filter(comment=comment).order_by('level')
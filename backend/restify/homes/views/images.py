from django.shortcuts import get_object_or_404
from .manage_home import IsHostPermission
from rest_framework.generics import CreateAPIView, DestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from ..serializers.images import ImageSerializer
from ..models import Images, Home
from rest_framework.permissions import BasePermission
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50

class ListImages(ListAPIView):
    serializer_class = ImageSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        home = self.get_object()
        return Images.objects.filter(home=home)
    
    def get_object(self):
        return get_object_or_404(Home, id=self.kwargs['pk'])

class AddImage(CreateAPIView):
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated, IsHostPermission, ]

    def perform_create(self, serializer):
        home = self.get_object()
        serializer.save(
            home = home
        )

    def get_object(self):
        obj = get_object_or_404(Home, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    

class ImageBelongs(BasePermission):
    message = "This image does not belong to this home"

    def has_object_permission(self, request, view, obj):
        home = get_object_or_404(Home, id=view.kwargs['pk'])
        if obj.home == home:
            return True
        return False

class IsHomeHost(BasePermission):
    message = 'You are not a host of this home'
    
    def has_permission(self, request, view):
        home = get_object_or_404(Home, id=view.kwargs['pk'])
        if request.user == home.owner:
            return True
        return False
    
class DeleteImage(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsHomeHost, ImageBelongs]

    def get_object(self):
        obj = get_object_or_404(Images, id=self.kwargs['image_pk'])
        self.check_object_permissions(self.request, obj)
        return obj
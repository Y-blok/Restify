from django.shortcuts import get_object_or_404
from rest_framework.generics import GenericAPIView, UpdateAPIView, ListAPIView
from .models import Notification
from rest_framework.permissions import IsAuthenticated
from .serializers import NotificationSerializer
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class NotifList(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Notification.objects.filter(notifee=self.request.user).order_by("read", "date")
    

class OwnsNotif(BasePermission):
    message = "You do not own this notification"

    def has_object_permission(self, request, view, obj):
        return (obj.notifee == request.user)

class ReadNotif(UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, OwnsNotif ] 

    def perform_update(self, serializer):
        notif = self.get_object()
        print(notif.notifee == self.request.user)
        serializer.save(
            read = True
        )

    def get_object(self):
        obj = get_object_or_404(Notification, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

class ReadAllNotifs(GenericAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        Notification.objects.filter(notifee = self.request.user, read=False).update(read=True)
        return Response(status=200)

class ClearNotifs(GenericAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        Notification.objects.filter(notifee = self.request.user, read=True).delete()
        return Response(status=204)

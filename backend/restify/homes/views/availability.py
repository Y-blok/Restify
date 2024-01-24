from datetime import date, datetime
from django.shortcuts import get_object_or_404
from django.urls import reverse

from notifications.models import Notification
from .manage_home import IsHostPermission
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.serializers import ValidationError
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.pagination import PageNumberPagination
from ..serializers.price import PriceCreateSerializer
from ..models import Home, Price, Reservation
from .images import IsHomeHost
from django.db.models import Q

class CreateAvailability(CreateAPIView):
    serializer_class = PriceCreateSerializer
    permission_classes = [IsAuthenticated, IsHostPermission]


    def perform_create(self, serializer):
        home = self.get_object()

        start = self.request.data['start_date']
        end = self.request.data['end_date']

        if datetime.strptime(end, '%Y-%m-%d').date() < datetime.strptime(start, '%Y-%m-%d').date():
            raise ValidationError({
                'end' : 'Must end after start date'
            })
        
        if datetime.strptime(start, '%Y-%m-%d').date() < date.today():
            raise ValidationError({
                'start' : 'Cannot add availability in the past'
            }) 


        if Price.objects.filter(end_date__gte=end, start_date__lte=end, home=home).first():
            raise ValidationError({
                'end' : 'Date overlaps with previously created availability'
            })
        
        if Price.objects.filter(end_date__gte=start, start_date__lte=start, home=home).first():
            raise ValidationError({
                'start' : 'Date overlaps with previously created availability'
            })
        
        if Price.objects.filter(start_date__lte=start, end_date__gte=end, home=home).first() or \
           Price.objects.filter(start_date__gte=start, end_date__lte=end, home=home).first():
            raise ValidationError({
                'start' : 'Dates overlap with previously created availability',
                'end' : 'Dates overlap with previously created availability',
            })
            
        
        serializer.save(
            home = home
        )
    

    def get_object(self):
        obj = get_object_or_404(Home, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    


class HomeMatchAvailability(BasePermission):

    def has_object_permission(self, request, view, obj):
        home = get_object_or_404(Home, id=view.kwargs['pk'])
        if obj.home != home:
            return False
        
        return True

class UpdateAvailability(UpdateAPIView):
    serializer_class = PriceCreateSerializer
    permission_classes = [IsAuthenticated, IsHomeHost, HomeMatchAvailability, ]


    def perform_update(self, serializer):
        availability = self.get_object()
        home = get_object_or_404(Home, id=self.kwargs['pk'])
        
        start = availability.start_date
        end = availability.end_date
        if 'start_date' in self.request.data:
            start = self.request.data['start_date']
        
        if 'end_date' in self.request.data:
            end = self.request.data['end_date']

        reservations = Reservation.objects.filter(home=home, start_date__gte=start, end_date__lte=end)

        if datetime.strptime(end, '%Y-%m-%d').date() < datetime.strptime(start, '%Y-%m-%d').date():
            raise ValidationError({
                'end_date' : 'Must end after start date'
            })
        
        if datetime.strptime(start, '%Y-%m-%d').date() < date.today():
            raise ValidationError({
                'start_date' : 'Cannot add availability in the past'
            }) 


        if Price.objects.filter(end_date__gte=end, start_date__lte=end, home=home).exclude(id=availability.id).first():
            raise ValidationError({
                'end_date' : 'Date overlaps with previously created availability'
            })
        
        if Price.objects.filter(end_date__gte=start, start_date__lte=start, home=home).exclude(id=availability.id).first():
            raise ValidationError({
                'start_date' : 'Date overlaps with previously created availability'
            })
        
        if Price.objects.filter(start_date__lte=start, end_date__gte=end, home=home).exclude(id=availability.id).first() or \
           Price.objects.filter(start_date__gte=start, end_date__lte=end, home=home).exclude(id=availability.id).first():
            raise ValidationError({
                'start_date' : 'Dates overlap with previously created availability',
                'end_date' : 'Dates overlap with previously created availability',
            })
            
        for reservation in reservations:
            if reservation.status == 0:
                reservation.status = 1

            if reservation.status == 4:
                reservation.status = 6

            if reservation.status == 5:
                reservation.status = 4
                Notification.objects.create(
                    message = f"Your cancelation request for reservation of {reservation.home.name} has been approved",
                    notifee = reservation.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":reservation.home.id, "res_pk":reservation.id})),
                    notification_object = reservation
                    )

            reservation.save()
        
        serializer.save()

    def get_object(self):
        obj = get_object_or_404(Price, id=self.kwargs['avail_id'])
        self.check_object_permissions(self.request, obj)
        return obj


class DeleteAvailability(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsHomeHost, HomeMatchAvailability, ]
        
    def perform_destroy(self, instance):
        availability = self.get_object()
        home = get_object_or_404(Home, id=self.kwargs['pk'])
        
        start = availability.start_date
        end = availability.end_date

        reservations = Reservation.objects.filter(home=home, start_date__gte=start, end_date__lte=end)
        
        for reservation in reservations:
            if reservation.status == 0:
                reservation.status = 1
                Notification.objects.create(
                    message = f"Your reservation of {reservation.home.name} from {reservation.start_date} to {reservation.end_date} has been denied",
                    notifee = reservation.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":reservation.home.id, "res_pk":reservation.id})),
                    notification_object = reservation
                    )

            if reservation.status == 4:
                reservation.status = 6
                Notification.objects.create(
                    message = f"Your reservation of {reservation.home.name} from {reservation.start_date} to {reservation.end_date} has been terminated",
                    notifee = reservation.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":reservation.home.id, "res_pk":reservation.id})),
                    notification_object = reservation
                    )

            if reservation.status == 5:
                reservation.status = 4
                Notification.objects.create(
                    message = f"Your cancelation request for reservation of {reservation.home.name} has been approved",
                    notifee = reservation.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":reservation.home.id, "res_pk":reservation.id})),
                    notification_object = reservation
                    )

            reservation.save()
        
        return super().perform_destroy(instance)
    
    def get_object(self):
        obj = get_object_or_404(Price, id=self.kwargs['avail_id'])
        self.check_object_permissions(self.request, obj)
        return obj
    

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50

class ListAvail(ListAPIView):
    serializer_class = PriceCreateSerializer

    def get_queryset(self):
        home = self.get_object()
        query_set = Price.objects.filter(home=home).order_by('start_date')
        
        if 'month' in self.request.GET:
            filter_month = datetime.strptime(self.request.GET['month'], '%Y-%m-%d')
            
            query_set = query_set.filter(Q(start_date__year__lte=filter_month.year) | Q(end_date__year__gte = filter_month.year))\
                .filter(Q(start_date__month = filter_month.month) | Q(Q(start_date__lte=filter_month) & Q(end_date__gte=filter_month)))
            
        else:
            self.pagination_class = StandardResultsSetPagination
            
        return query_set
    
    def get_object(self):
        return get_object_or_404(Home, id=self.kwargs['pk'])
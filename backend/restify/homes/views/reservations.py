from django.urls import reverse
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView, ListAPIView
from homes.serializers.reservations import ReservationCreateSerializer, ReservationEditSerializer,  ReservationCancelSerializer, ReservationDetailSerializer, ReservationListSerializer, ReservationSimpleSerializer
from homes.models import Home, Reservation, Price
from account.models import User
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.shortcuts import get_object_or_404
from rest_framework.serializers import ValidationError
from datetime import datetime, date
from rest_framework.pagination import PageNumberPagination
from notifications.models import Notification
from django.db.models import Q

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class isOwnerReserve(BasePermission):
    message = "You cannot make a reservation in a home you own"

    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            return False
        return True
    
class isOwnerEdit(BasePermission):
    message = "You must be the owner of this home"

    def has_permission(self, request, view):
        home = get_object_or_404(Home, id=view.kwargs['pk'])
        if request.user != home.owner:
            return False
        return True
    
class isReservationHome(BasePermission):
    message = "No Such reservation has been made for this home"

    def has_permission(self, request, view):
        home = get_object_or_404(Home, id=view.kwargs['pk'])
        reservation = Reservation.objects.get(id=view.kwargs['res_pk'])
        if reservation.home != home:
            return False
        return True
    
class isRenter(BasePermission):
    message = "You did not create this reservation"
    def has_object_permission(self, request, view, obj):
        return obj.renter == request.user
    
class canViewRes(BasePermission):
    message = "You must be the host or the renter to view this reservation"
    def has_permission(self, request, view):
        home = Home.objects.get(id=view.kwargs['pk'])
        reservation = Reservation.objects.get(id=view.kwargs['res_pk'])
        if (request.user != home.owner) and (request.user != reservation.renter):
            return False
        return True

class ReservationCreateView(CreateAPIView):
    serializer_class = ReservationCreateSerializer
    permission_classes = [IsAuthenticated, isOwnerReserve]

    def perform_create(self, serializer):
        cur_home = Home.objects.get(id=self.kwargs['pk'])
        cur_renter = User.objects.get(id=self.request.user.id)
        start = self.request.data['start_date']
        end = self.request.data['end_date']
        expire = self.request.data['expiry_date']

        if datetime.strptime(end, '%Y-%m-%d').date() < datetime.strptime(start, '%Y-%m-%d').date():
            raise ValidationError({
                'end_date' : 'Must end after start date'
            })
        if datetime.strptime(start, '%Y-%m-%d').date() < date.today():
            raise ValidationError({
                'start_date' : 'Cannot create reservation in the past'
            })
        if datetime.strptime(start, '%Y-%m-%d').date() <= datetime.strptime(expire, '%Y-%m-%d').date():
            raise ValidationError({
                'expiry_date' : 'Must expire before the start date'
            })
        if datetime.strptime(expire, '%Y-%m-%d').date() < date.today():
            raise ValidationError({
                'expiry_date' : 'Cannot be set to expire in the past'
            })
        if Reservation.objects.filter(end_date__gte=end, 
                                      start_date__lte=end, 
                                      home=cur_home).exclude(status=1).exclude(status=2).exclude(status=4).exclude(status=6).first():
            raise ValidationError({
                'end_date' : 'Date overlaps with another reservation'
            })
        if Reservation.objects.filter(end_date__gte=start, 
                                      start_date__lte=start, 
                                      home=cur_home).exclude(status=1).exclude(status=2).exclude(status=4).exclude(status=6).first():
            raise ValidationError({
                'start_date' : 'Date overlaps with another reservation'
            })
        if Reservation.objects.filter(start_date__lte=start, 
                                      end_date__gte=end, 
                                      home=cur_home).exclude(status=1).exclude(status=2).exclude(status=4).exclude(status=6).first() or \
           Reservation.objects.filter(start_date__gte=start, 
                                      end_date__lte=end, 
                                      home=cur_home).exclude(status=1).exclude(status=2).exclude(status=4).exclude(status=6).first():
            raise ValidationError({
                'start_date' : 'Dates overlap with another reservation',
                'end_date' : 'Dates overlap with another reservation',
            })
        if not Price.objects.filter(start_date__lte=start, end_date__gte=end, home=cur_home).first():
            raise ValidationError({
                'start_date' : 'Dates not within availibility',
                'end_date' : 'Dates not within availibility',
            })
        res = serializer.save(
            home = cur_home,
            renter = cur_renter
        )
        Notification.objects.create(
            message = f"New reservation for {cur_home.name} from {start} to {end}",
            notifee = cur_home.owner,
            notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":cur_home.id, "res_pk":res.id})),
            notification_object = res
            )


    def get_object(self):
        obj = get_object_or_404(Home, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
class ReservationEditStatusView(UpdateAPIView):
    serializer_class = ReservationEditSerializer
    permission_classes = [IsAuthenticated, isOwnerEdit, isReservationHome]

    def get_object(self):
        obj = get_object_or_404(Reservation, id=self.kwargs['res_pk'])

        if obj.status == 0 and obj.expiry_date < date.today():
            obj.status = 2
        elif obj.status == 3 and obj.end_date < date.today():
            obj.status = 7
        obj.save()
        
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_update(self, serializer):
        cur_res = self.get_object()
        cur_status = cur_res.status
        print("PRINTING STATUS")
        print(self.request.data)
        new_status = int(self.request.data['status'])
        if (cur_status == 0):
            if new_status == 1:
                Notification.objects.create(
                    message = f"Your reservation of {cur_res.home.name} from {cur_res.start_date} to {cur_res.end_date} has been denied",
                    notifee = cur_res.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":cur_res.home.id, "res_pk":cur_res.id})),
                    notification_object = cur_res
                    )
                
            elif new_status == 3:
                Notification.objects.create(
                    message = f"Your reservation of {cur_res.home.name} from {cur_res.start_date} to {cur_res.end_date} has been approved",
                    notifee = cur_res.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":cur_res.home.id, "res_pk":cur_res.id})),
                    notification_object = cur_res
                    )
            else:
                raise ValidationError({
                    'status': 'Invalid new status',
                })
        elif (cur_status == 3):
            if (new_status == 6):
                Notification.objects.create(
                    message = f"Your reservation of {cur_res.home.name} from {cur_res.start_date} to {cur_res.end_date} has been terminated",
                    notifee = cur_res.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":cur_res.home.id, "res_pk":cur_res.id})),
                    notification_object = cur_res
                    )
            else:
                raise ValidationError({
                    'status': 'Invalid new status',
                })
        elif (cur_status == 5):
            if (new_status == 3):
                Notification.objects.create(
                    message = f"Your cancelation request for reservation of {cur_res.home.name} has been denied",
                    notifee = cur_res.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":cur_res.home.id, "res_pk":cur_res.id})),
                    notification_object = cur_res
                    )
            elif new_status == 4:
                Notification.objects.create(
                    message = f"Your cancelation request for reservation of {cur_res.home.name} has been approved",
                    notifee = cur_res.renter,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":cur_res.home.id, "res_pk":cur_res.id})),
                    notification_object = cur_res
                    )
            else:
                raise ValidationError({
                    'status': 'Invalid new status',
                })
        elif cur_status != new_status:
            raise ValidationError({
                'status': 'Invalid new status',
            })
        return super().perform_update(serializer)
    
class ReservationCancelView(UpdateAPIView):
    serializer_class = ReservationCancelSerializer
    permission_classes = [IsAuthenticated, isRenter, isReservationHome, ]

    def get_object(self):
        obj = get_object_or_404(Reservation, id=self.kwargs['res_pk'])

        if obj.status == 0 and obj.expiry_date < date.today():
            obj.status = 2
        elif obj.status == 3 and obj.end_date < date.today():
            obj.status = 7
        
        obj.save()
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_update(self, serializer):
        cur_res = self.get_object()
        cur_status = cur_res.status
        if cur_status == 3:
            serializer.save(status=5)
            Notification.objects.create(
                    message = f"There is a cancelation request for reservation of {cur_res.home.name} by {cur_res.renter}",
                    notifee = cur_res.home.owner,
                    notif_link = self.request.build_absolute_uri(reverse("homes:res-detail", kwargs={"pk":cur_res.home.id, "res_pk":cur_res.id})),
                    notification_object = cur_res
                    )
            
        elif cur_status == 5:
            raise ValidationError ({
                'status': 'Already requested cancellation'
            })
        elif cur_status in [1, 2, 6, 7]:
            raise ValidationError ({
                'status': 'Cannot cancel'
            })
        else:
            serializer.save(status=4)

class ReservationDetailView(RetrieveAPIView):
    serializer_class = ReservationDetailSerializer
    permission_classes = [IsAuthenticated, canViewRes, isReservationHome]

    def get_object(self):
        obj = get_object_or_404(Reservation, id=self.kwargs['res_pk'])
        if obj.status == 0 and obj.expiry_date < date.today():
            obj.status = 2
        elif obj.status == 3 and obj.end_date < date.today():
            obj.status = 7
        obj.save()
        self.check_object_permissions(self.request, obj)
        return obj
    
class ReservationListView(ListAPIView):
    serializer_class = ReservationListSerializer
    permission_classes = [IsAuthenticated, isOwnerEdit]
    pagination_class = StandardResultsSetPagination

    def get_object(self):
        obj = get_object_or_404(Home, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        cur_home = self.get_object()
        query_set = Reservation.objects.filter(home=cur_home)
        for reservation in query_set:
            if reservation.status == 0 and reservation.expiry_date < date.today():
                reservation.status = 2
            elif reservation.status == 3 and reservation.end_date < date.today():
                reservation.status = 7
            reservation.save()
        if 'status' in self.request.GET:
            query_set = query_set.filter(status=self.request.GET['status'])
        return query_set
        
    

    
class ReservationMonthList(ListAPIView):
    serializer_class = ReservationSimpleSerializer

    def get_object(self):
        obj = get_object_or_404(Home, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get_queryset(self):
        if 'month' not in self.request.GET:
            raise ValidationError({"message":"No Month Provided"})
        
        cur_home = self.get_object()
        filter_month = datetime.strptime(self.request.GET['month'], '%Y-%m-%d')

        query_set = Reservation.objects.filter(home=cur_home)

        for reservation in query_set:
            if reservation.status == 0 and reservation.expiry_date < date.today():
                reservation.status = 2
            elif reservation.status == 3 and reservation.end_date < date.today():
                reservation.status = 7
            reservation.save()
        
        query_set = query_set.exclude(status=1).exclude(status=2).exclude(status=4).exclude(status=6).exclude(status=7)
        query_set = query_set.filter(start_date__year=filter_month.year)\
            .filter(Q(start_date__month = filter_month.month) | Q(Q(start_date__lte=filter_month) & Q(end_date__gte=filter_month)))
        return query_set


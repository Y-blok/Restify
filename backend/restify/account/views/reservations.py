from homes.serializers.manage_home import HomeCreationSerializer
from account.models import User
from homes.models import Reservation
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from datetime import date, datetime
from rest_framework.pagination import PageNumberPagination

from rest_framework import serializers

class UserReservationSerializer(serializers.ModelSerializer):
    home = HomeCreationSerializer()
    
    class Meta:
        model = Reservation
        fields = ['id', 'home', 'renter', 'start_date', 'end_date', 'expiry_date', 'status']

class SmallResultsSetPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 25

class UserReservationsList(ListAPIView):
    serializer_class = UserReservationSerializer
    pagination_class = SmallResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        reservations = Reservation.objects.filter(renter=self.request.user)
        # Update statuses
        for reservation in reservations:
            if reservation.status==0 and reservation.expiry_date < date.today():
                reservation.status = 2
                reservation.save()
            if reservation.status==3 and reservation.end_date < date.today():
                reservation.status = 7
                reservation.save()
        
        # Filter by status
        if 'status' in self.request.GET:
            reservations = reservations.filter(status=self.request.GET['status'])
        
        return reservations


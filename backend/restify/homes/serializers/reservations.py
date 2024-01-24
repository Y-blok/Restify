from rest_framework import serializers
from homes.serializers.manage_home import HomeCreationSerializer
from account.serializers import UserDetailSerializer
from homes.models import Reservation

class ReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'home', 'renter', 'start_date', 'end_date', 'expiry_date', 'status']
        extra_kwargs = {
            'home': {
                'required': False,
            },
            'renter': {
                'required': False,
            }
        } 

    def create(self, validated_data):
        return super().create(validated_data)
    
class ReservationEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['status']

    
class ReservationCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'home', 'renter', 'start_date', 'end_date', 'expiry_date', 'status']

class ReservationDetailSerializer(serializers.ModelSerializer):
    renter = UserDetailSerializer()
    home = HomeCreationSerializer()
    class Meta:
        model = Reservation
        fields = ['id', 'home', 'renter', 'start_date', 'end_date', 'expiry_date', 'status']
    
class ReservationListSerializer(serializers.ModelSerializer):
    renter = UserDetailSerializer()
    home = HomeCreationSerializer()
    class Meta:
        model = Reservation
        fields = ['id', 'home', 'renter', 'start_date', 'end_date', 'expiry_date', 'status']

class ReservationSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'start_date', 'end_date']


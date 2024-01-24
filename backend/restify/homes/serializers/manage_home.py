from rest_framework import serializers
from ..models import Home
from comments.models import Comment
from notifications.models import Notification
from account.serializers import UserDetailSerializer

class HomeCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Home
        fields = ['id', 'name', 'description', 'baths', 'beds', 'guests', 
                  'street_address', 'city', 'state', 'country', 
                  'image']

    def create(self, validated_data):
        return super().create(validated_data)
    
class HomeUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Home
        fields = ['name', 'description', 'baths', 'beds', 'guests', 
                  'street_address', 'city', 'state', 'country', 
                  'image']

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
class HomeDetailSerializer(serializers.ModelSerializer):
    owner = UserDetailSerializer()

    class Meta:
        model = Home
        fields = ['id', 'name', 'description', 'baths', 'beds', 'guests', 
                  'street_address', 'city', 'state', 'country', 
                  'image', 'owner', 'rating_sum', 'rating_number']
        
class HomeSearchSerializer(serializers.ModelSerializer):
    owner = UserDetailSerializer()

    class Meta:
        model = Home
        fields = ['id', 'name', 'description', 'baths', 'beds', 'guests', 
                  'street_address', 'city', 'state', 'country', 
                  'image', 'owner', 'rating_sum', 'rating_number']
        
class HomeOwnedSerializer(serializers.ModelSerializer):
    # owner = UserDetailSerializer()

    class Meta:
        model = Home
        fields = ['id', 'name', 'description', 'baths', 'beds', 'guests', 
                  'street_address', 'city', 'state', 'country', 
                  'image', 'rating_sum', 'rating_number']
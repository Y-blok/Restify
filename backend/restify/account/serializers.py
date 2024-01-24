from rest_framework import serializers
from .models import User
from comments.models import Comment
from notifications.models import Notification

class UserCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'phone', 'about', 'profile_pic', 'password', ]
        extra_kwargs = {
            "password": {"write_only": True},
            "first_name" : {'required':True},
            "last_name" : {'required':True}
            }

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()

        return user
    
class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'about', 'profile_pic', 'password', ]
        extra_kwargs = {"password": {"write_only": True} } 

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)

        if 'password' in validated_data:
            user.set_password(validated_data['password'])
            user.save()

        return user
    

class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', ]


class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'phone', 'about', 'profile_pic', 'rating_sum', 'rating_number', 'date_joined']
        

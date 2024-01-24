from rest_framework import serializers
from account.serializers import BasicUserSerializer
from .models import User
from comments.models import Comment, Response

class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['rating', 'message', 'datetime']

class CreateResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ['message', 'datetime']


class CommentSerializer(serializers.ModelSerializer):
    comentee = BasicUserSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'rating', 'message', 'comentee', 'datetime']

    
class ResponseSerializer(serializers.ModelSerializer):
    comentee = BasicUserSerializer()

    class Meta:
        model = Response
        fields = ['level', 'id', 'message', 'comentee', 'datetime']


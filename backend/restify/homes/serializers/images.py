from rest_framework import serializers
from ..models import Images

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ['home', 'image', 'alt', 'id']
        extra_kwargs = {
            "home": { "required" : False },
        }

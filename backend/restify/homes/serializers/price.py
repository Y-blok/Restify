from rest_framework import serializers
from ..models import Price

class PriceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ['home', 'price', 'start_date', 'end_date', 'id']
        extra_kwargs = {
            "home": { "required" : False },
        }

        
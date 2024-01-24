from rest_framework.generics import CreateAPIView
from account.serializers import UserCreationSerializer

class SignupView(CreateAPIView):
    serializer_class = UserCreationSerializer
    
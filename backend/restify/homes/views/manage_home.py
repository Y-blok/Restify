from rest_framework.generics import CreateAPIView, RetrieveAPIView,UpdateAPIView, ListAPIView, DestroyAPIView
from homes.serializers.manage_home import HomeCreationSerializer, HomeUpdateSerializer, HomeDetailSerializer, HomeSearchSerializer, HomeOwnedSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission
from account.models import User
from ..models import Home
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination

class HomeCreateView(CreateAPIView):
    serializer_class = HomeCreationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        cur_user = User.objects.get(id=self.request.user.id)
        serializer.save(
            owner = cur_user
        )

class IsHostPermission(BasePermission):
    message = 'You are not a host of this home'

    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            return True
        
        return False

class HomeUpdateView(UpdateAPIView):
    serializer_class = HomeUpdateSerializer
    permission_classes = [IsAuthenticated, IsHostPermission]

    def get_object(self):
        obj = get_object_or_404(Home, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
class HomeDetailView(RetrieveAPIView):
    serializer_class = HomeDetailSerializer

    def get_object(self):
        return get_object_or_404(Home, id=self.kwargs['pk'])
    
class DeleteHome(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsHostPermission]
    
    def get_object(self):
        obj = get_object_or_404(Home, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 25

class HomeOwnedList(ListAPIView):
    serializer_class = HomeOwnedSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):

        homes = Home.objects.all()

        return homes.filter(owner=self.request.user)

class HomeSearchList(ListAPIView):
    serializer_class = HomeSearchSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):

        homes = Home.objects.all()

        print(self.request.GET)

        # Filter by city
        if 'city' in self.request.GET:
            homes = homes.filter(city=self.request.GET['city'])

        # Filter by state
        if 'state' in self.request.GET:
            homes = homes.filter(state=self.request.GET['state'])

        # Filter by country
        if 'country' in self.request.GET:
            homes = homes.filter(country=self.request.GET['country'])

        # Filter by (>=) baths
        if 'baths' in self.request.GET:
            homes = homes.filter(baths__gte=self.request.GET['baths'])

        # Filter by (>=) beds
        if 'beds' in self.request.GET:
            homes = homes.filter(beds__gte=self.request.GET['beds'])

        # Filter by (>=) rating number
        if 'rating_number' in self.request.GET:
            homes = homes.filter(rating_number__gte=self.request.GET['rating_number'])

        # Filter by (>=) number of guests
        if 'guests' in self.request.GET:
            homes = homes.filter(guests__gte=self.request.GET['guests'])
        
        # Order by (descending) rating_number
        if 'sort_rating_number' in self.request.GET:
            homes = homes.order_by('-rating_number')

        # Order by (ascending) baths
        if 'sort_baths' in self.request.GET:
            homes = homes.order_by('baths')

        # Order by (ascending) beds
        if 'sort_beds' in self.request.GET:
            homes = homes.order_by('beds')
        
        return homes


class SmallResultsSetPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 25

class HomeUserList(ListAPIView):
    serializer_class = HomeSearchSerializer
    pagination_class = SmallResultsSetPagination

    def get_queryset(self):
        user = self.get_object()
        return Home.objects.filter(owner=user)
    
    def get_object(self):
        return User.objects.get(id=self.kwargs['pk'])
from datetime import date, timedelta
from django.db import models
from comments.models import Comment
from account.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericRelation

class Home(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=500, blank=True)

    baths = models.PositiveIntegerField(default=1)
    beds = models.PositiveIntegerField(default=1)

    guests = models.PositiveIntegerField(default=2)

    street_address = models.CharField(max_length=50)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50)

    date_added = models.DateTimeField(auto_now_add=True)

    image = models.ImageField(upload_to="homes", default="homes/default.png")

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_homes")
    comments = GenericRelation(Comment)
    rating_sum = models.IntegerField(default=0)
    rating_number = models.IntegerField(default=0)

    def __str__(self):
        return f"({self.id}): {self.name}"

class Price(models.Model):
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name="prices")

    price = models.FloatField(validators=[MinValueValidator(0.00)])
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.home.name}: {self.start_date} to {self.end_date}"

class Images(models.Model):
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name="images")

    image = models.ImageField(upload_to="home_images")
    alt = models.CharField(max_length=50, default="")

    def __str__(self):
        return f"({self.id}) Image for {self.home}: {self.alt}" 


class Reservation(models.Model):
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name="reservations")
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reserved_homes")
    start_date = models.DateField()
    end_date = models.DateField()
    expiry_date = models.DateField()

    notifs = GenericRelation('notifications.Notification')

    status = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(7)])

    def __str__(self):
        return f"({self.id}): {self.renter}'s reservation of {self.home}"

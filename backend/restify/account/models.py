from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

from django.contrib.contenttypes.fields import GenericRelation

# Create your models here.
class User(AbstractUser):
    phone_regex = RegexValidator(r'\d{10}', message="Phone number must be 10 digits long and in the following format: 1234567890")
    phone = models.CharField(_("phone number"), max_length=10, validators=[phone_regex], blank=True)
    about = models.CharField(_("about"), max_length=500, blank=True)

    comments = GenericRelation('comments.Comment')
    notifications = GenericRelation('notifications.Notification')
    rating_sum = models.IntegerField(default=0)
    rating_number = models.IntegerField(default=0)

    profile_pic = models.ImageField(upload_to="profile", default="profile/default.jpg")

    REQUIRED_FIELDS = ['email', 'phone']


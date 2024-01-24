from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from account.models import User

class Notification(models.Model):
    message = models.CharField(max_length=250)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    notification_object = GenericForeignKey('content_type', 'object_id')

    notifee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    notif_link = models.URLField(default="/")

    date = models.DateTimeField(auto_now_add=True)

    read = models.BooleanField(default=False)


    def __str__(self):
        return f'({self.id}): {self.notifee} notification about {self.notification_object}'

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.core.validators import MaxValueValidator
from account.models import User

# Create your models here.
class Comment(models.Model):
    rating = models.PositiveIntegerField(validators=[MaxValueValidator(5)], default=0)
    message = models.CharField(max_length=250)
    datetime = models.DateTimeField(auto_now_add=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()

    comment_object = GenericForeignKey('content_type', 'object_id')
    comentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mycomments")


    def __str__(self):
        return f"({self.id}): {self.comentee}'s comment of {self.comment_object}"

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]
    
class Response(models.Model):
    message = models.CharField(max_length=250)
    datetime = models.DateTimeField(auto_now_add=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    
    response_object = GenericForeignKey('content_type', 'object_id')
    comentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="myresponses")
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    level = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"({self.id}): {self.comentee}'s comment of {self.response_object}"

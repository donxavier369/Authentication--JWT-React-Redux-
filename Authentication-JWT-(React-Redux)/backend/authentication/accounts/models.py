from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken



# Create your models here.

class CustomUser(AbstractUser):
    email = models.EmailField(max_length=255, unique=True, db_index=True)
    userimage = models.ImageField(upload_to='profileimage')

    def __str__(self) -> str:
        return self.username


    # def tokens(self):
    #     refresh = RefreshToken.for_user(self)
    #     return{
    #         'refresh': str(refresh),
    #         'access': str(refresh.access_token)
    #     }

class UserProfile(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    userimage = models.ImageField(upload_to='profileimage')
    isimage = models.BooleanField(default=False)


    # def __str__(self) -> str:
    #     return self.userimage


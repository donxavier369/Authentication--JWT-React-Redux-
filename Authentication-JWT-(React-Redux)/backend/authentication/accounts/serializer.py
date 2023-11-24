from rest_framework import serializers
from accounts.models import CustomUser,UserProfile
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, Token, TokenError
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator
from django.contrib.humanize.templatetags import humanize



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only = True)#used for input (registration) but not included in the response.write_only
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all(), message="Username already exists.")]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all(), message="Email already exists.")]
    )
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password']
    def validate(self, attrs):
        email = attrs.get('email', '')
        username = attrs.get('username', '')
        if not username.isalnum(): # check alphanumeric
            raise serializers.ValidationError(
                self.default_error_messages
            )
        print("this is attrs:",attrs)
        return attrs
    
    def create(self, validated_data):
        print(validated_data,"this is the validate data")
        # return User.objects.create(**validated_data)
        password = validated_data['password']
        hashed_password = make_password(password)
        user = CustomUser.objects.create(
            email = validated_data['email'],
            username = validated_data['username'],
            password = hashed_password
        )
        user.save()
        return user


    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['image']

class UserProfileDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        print(user,"userrrrrrrrrrr")
        token = super().get_token(user)
        token['superuser'] = user.is_superuser
        token['name'] = user.username
        token['email'] = user.email
        token['is_active'] = user.is_active
        print(token,"tokennnnnnnn")
        return token
        


class LogoutSerializer(serializers.Serializer):
    print("gettttttttttttt")
    refresh = serializers.CharField() # for accept the refresh token
    def validate(self, attrs):
        self.token = attrs['refresh'] # store the token in the self.token
        print(self.token,"refressssssssssssstoken",attrs)
        return attrs
    def save(self, **Kwrgs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')



class UserSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = CustomUser
        fields = '__all__'


class UserProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'



class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']




class UserProfileCustomUserSerializer(serializers.Serializer):
    userimage = serializers.SerializerMethodField()
    username = serializers.CharField()
    email = serializers.EmailField()
    image = serializers.SerializerMethodField()

    def get_userimage(self, instance):
        return instance.user.userimage.url if instance.user.userimage else None

    def get_image(self, instance):
        return instance.user.image.url if instance.user.image else None

    def to_representation(self, instance):
        return {
            'userimage': self.get_userimage(instance),
            'username': instance.user.username,
            'email': instance.user.email,
            'image': self.get_image(instance),
        }

# from rest_framework import serializers
# from .models import UserProfile, CustomUser

# class UserProfileCustomUserSerializer(serializers.Serializer):
#     userimage = serializers.ImageField()
#     username = serializers.CharField()
#     email = serializers.EmailField()
#     image = serializers.ImageField()

#     def to_representation(self, instance):
#         user_profile = instance
#         custom_user = instance.user

#         return {
#             'userimage': user_profile.userimage,
#             'username': custom_user.username,
#             'email': custom_user.email,
#             'image': custom_user.image,
#         }


# class UserProfileCustomUserSerializer(serializers.ModelSerializer):
#     userimage = serializers.ImageField()
#     username = serializers.CharField(source='user.username')
#     email = serializers.EmailField(source='user.email')
#     image = serializers.ImageField(source='user.image')

#     class Meta:
#         model = UserProfile
#         fields = ['userimage', 'username', 'email', 'image']


# class LogoutSerializer(serializers.Serializer):
#     refresh = serializers.CharField()  # For accepting the refresh token

#     def validate(self, attrs):
#         self.token = attrs['refresh']  # Store the token in self.token
#         return attrs

#     def save(self, **kwargs):
#         try:
#             refresh_token = RefreshToken(self.token)
#             refresh_token.blacklist()
#         except AuthenticationFailed:
#             self.fail('bad_token')



# class LoginSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(max_length=68, min_length=6, write_only = True)
#     username = serializers.CharField(max_length=255, min_length=3)
#     token = serializers.SerializerMethodField()
#     def get_token(self, obj): #generating jwt token
#         user = CustomUser.objects.get(username=obj['username'])
#         print(user,"token userrrrrrrrrr")
#         token = user.tokens()
#         token['is_superuser'] = user.username
#         print(token,"tokensssssssssssssssss")
#         return token
    
#     class Meta:
#         model = CustomUser
#         fields = ['password', 'username', 'token']

#     def validate(self, attrs):
#         username = attrs.get('username', '')
#         password = attrs.get('password', '')
#         print(username,"userrrrrrrname",password)
#         user = auth.authenticate(username=username, password=password)
#         print(user,"userrrrrrrrrrrrr")
#         if not user:
#             raise AuthenticationFailed('Invalid credentials, try again')
#         if not user.is_active:
#             raise AuthenticationFailed('Account disabled, contact admin')
#         print(user.tokens,"tokensssssss")
#         return{
#             'email': user.email,
#             'username': user.username,
#             'token': user.tokens
#         }





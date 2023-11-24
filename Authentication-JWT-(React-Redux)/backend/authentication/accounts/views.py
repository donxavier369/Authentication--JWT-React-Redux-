from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import generics,status,views,permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializer import RegisterSerializer,LoginSerializer,LogoutSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .serializer import UserProfileSerializer,UserSerializer,UserUpdateSerializer,UserProfileCustomUserSerializer,UserProfileImageSerializer,UserProfileDetailSerializer
from .models import CustomUser,UserProfile
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FileUploadParser
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveUpdateAPIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from accounts.models import UserProfile  # Replace 'accounts' with the actual app name








# Create your views here.

# class RegisterView(generics.GenericAPIView):
#     serializer_class = RegisterSerializer
#     def post(self,request):
#         user = request.data
#         serializer = self.serializer_class(data=user)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         user_data = serializer.data
#         return Response(user_data, status=status.HTTP_201_CREATED)
    
class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    def post(self,request):
        user = request.data
        serializer = self.serializer_class(data=user)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    


class UserUpdateView(RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserUpdateSerializer

    def perform_update(self, serializer):
        # Get the current user object being updated
        user = self.get_object()
        print(user,"userrrrrrrrrrrrrrrrrrrrrrrrr")

        # Check if the provided email already exists for other users
        email = serializer.validated_data.get('email')
        if email and CustomUser.objects.filter(email=email).exclude(id=user.id).exists():
            return Response({'email': 'Email already exists for another user.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the provided username already exists for other users
        username = serializer.validated_data.get('username')
        if username and CustomUser.objects.filter(username=username).exclude(id=user.id).exists():
            return Response({'username': 'Username already exists for another user.'}, status=status.HTTP_400_BAD_REQUEST)

        # If the email and username are valid, perform the update
        serializer.save()


class ProfileImageUploadView(APIView):
    parser_classes = (MultiPartParser,FormParser)
    print('from profile view')
    def post(self, request):
        print(request, ":Request Data")  
        try:
            serializer = UserProfileSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                # serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors, "Serializer Errors")  
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    

class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer


class BlacklistTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')  # Use 'refresh_token' key
        # refresh_token = request.data.refresh_token
        print(refresh_token,"refreshhssssssssstoken",request.data)
        if not refresh_token:
            return Response({'error':'Error refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(refresh_token).blacklist()
            return Response({'message':'Token has been blacklisted successfully.'}, status=status.HTTP_200_OK)
        except:
            return Response({'error':'Invalid Token'})
        



# for listig the user
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    # serializer_class = UserProfileDetailSerializer

    def get_queryset(self):
        print("imagessssssssss")
        # Get the search term from the query parameters
        queryset = CustomUser.objects.all().order_by('id')  # Initialize the queryset with all objects
        # userprofile = UserProfile.objects.all()
        search_term = self.request.query_params.get('search', None)

        # If search term is provided, filter the queryset based on it
        if search_term:
            queryset = queryset.filter(
                Q(id__icontains=search_term) |
                Q(first_name__icontains=search_term) |
                Q(last_name__icontains=search_term) |
                Q(email__icontains=search_term)
            )
        
        return queryset
        # return userprofile




# class UserProfileListView(ListAPIView):
#     queryset = UserProfile.objects.all()
#     serializer_class = UserProfileCustomUserSerializer

class UserProfileListView(ListAPIView):
    queryset = UserProfile.objects.select_related('user')   
    serializer_class = UserProfileCustomUserSerializer


# for performing block and unblock
class BlockUnblockUserView(generics.UpdateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        return CustomUser.objects.all()

    def patch(self, request, *args, **kwargs):
        # The `self.get_object()` method retrieves the user object based on the ID from the URL.
        instance = self.get_object() # retrive user from database based on the id from request

        if instance:
            instance.is_active = not instance.is_active
            instance.save()

            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# for replacinge already existing image

class ReplaceProfileImage(generics.UpdateAPIView):
    serializer_class = UserProfileImageSerializer

    def get_queryset(self):
        return UserProfile.objects.all()
    
    def patch(self, request, *args, **kwargs):
        print("inside")
        # instance = self.get_queryset()
        instance = self.get_object()
        print(instance,"instenceeeeeeeeeeeeee")

        if instance:
            print(instance,"data from the database")
            print(request.data, "data from the request")
            instance.userimage = request.data.get('userimage')
            instance.save()

            # serializer = self.get_queryset(instance)
            return Response({"details":"Image updated Successfully"},  status=status.HTTP_201_CREATED)
        else:
            return Response({"detials": "User not found"}, status=status.HTTP_404_NOT_FOUND)





# for inserting a new image 
class UserProfileListCreateView(generics.ListCreateAPIView):
    print('fhgfhjfjhfjk')
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileImageSerializer



# for fetchign all data form the userprofile model
class UserProfileRetrieveView(APIView):
    def get(self, request, user_id):
        print(request.data,"data from request")
        user_profile = get_object_or_404(UserProfile, user_id=user_id)
        serializer =  UserProfileImageSerializer(user_profile)
        return Response(serializer.data)
    


class UserProfileDeleteView(APIView):
    def post(self, request, user_id):
        try:
            print(user_id,"this is the userId for updation")
            user_profile = UserProfile.objects.get(user=user_id)
        except UserProfile.DoesNotExist:
            return Response({"message": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if user_profile.userimage:
            # Delete the user image
            user_profile.userimage.delete()


            user_profile.isimage = True  # Corrected attribute name
            user_profile.save()
            user_profile.delete()

            return Response({"message": "User image deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No user image to delete"}, status=status.HTTP_204_NO_CONTENT)
    



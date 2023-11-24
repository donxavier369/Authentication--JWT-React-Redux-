from django.urls import path
from .import views
from rest_framework_simplejwt.views import TokenBlacklistView
from .views import UserListView,BlockUnblockUserView,UserUpdateView,UserProfileDeleteView, ReplaceProfileImage,ProfileImageUploadView,UserProfileListCreateView,UserProfileRetrieveView # Import the view


from rest_framework_simplejwt.views import(
    TokenRefreshView,
)

app_name = 'api'

urlpatterns = [
    path('register/',views.RegisterView.as_view(),name="register"),
    path('login/',views.LoginAPIView.as_view(),name="login"),
    path('logout/',views.BlacklistTokenView.as_view(),name="logout"),
    path('userslist/', UserListView.as_view(), name='userslist'),
    path('block-unblock/<int:pk>/', BlockUnblockUserView.as_view(), name='block-unblock'),
    path('updateUsers/<int:pk>/', UserUpdateView.as_view(), name='updateUsers'),
    
    path('uploadimage/',views.ProfileImageUploadView.as_view(),name='uploadimage'),
    path('userprofiles/', UserProfileListCreateView.as_view(), name='userprofile-list-create'),
    path('getuserprofile/<int:user_id>/', UserProfileRetrieveView.as_view(), name='userprofile-detail'),
    path('deleteuserprofile/<int:user_id>/', UserProfileDeleteView.as_view(), name="deleteuserprofile"),
    path('updateimage/<int:pk>/', views.ReplaceProfileImage.as_view(), name="updateimage"),
    path('userprofilesdata/', views.UserProfileListView.as_view(), name='user-profile-list'),




    # path('login/',views.TokenObtainPairView.as_view(),name="login"),
    # path('logout/',views.LogoutAPIView.as_view(),name="logout"),
    # path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



]

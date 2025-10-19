from django.contrib import admin
from django.urls import path, include
from authentication.views import CreateUserView, HomeView, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('home/', HomeView.as_view(), name='home'),
    path('logout/', LogoutView.as_view(), name ='logout')
]

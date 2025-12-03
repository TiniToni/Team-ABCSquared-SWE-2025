from django.contrib import admin
from django.urls import path, include
from authentication.views import CreateUserView, HomeView, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from quizzes.views import QuizViewSet, QuizSubmissionViewSet

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('home/', HomeView.as_view(), name='home'),
    path('logout/', LogoutView.as_view(), name ='logout'),
    path('api/quizzes/', QuizViewSet.as_view({'get': 'list'}), name='quiz_list'),
    path('api/quizzes/progress/', QuizViewSet.as_view({'get': 'progress'}), name='quiz_progress'),
    path('api/quizzes/<int:pk>/', QuizViewSet.as_view({'get': 'retrieve'}), name='quiz_detail'),
    path('api/quizzes/<int:pk>/submit/', QuizViewSet.as_view({'post': 'submit'}), name='quiz_submit'),
    path('api/submissions/', QuizSubmissionViewSet.as_view({'get': 'list'}), name='submission_list'),
    path('api/submissions/<int:pk>/', QuizSubmissionViewSet.as_view({'get': 'retrieve'}), name='submission_detail'),
]

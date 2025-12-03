from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Quiz, Choice, QuizSubmission, LessonQuizMapping, Unit1
from .serializers import QuizSerializer, QuizSubmissionSerializer, Unit1Serializer

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    # get what lesson a quiz is mapped to
    def get_lesson_mapping(self, quiz):
        try:
            return LessonQuizMapping.objects.get(quiz=quiz)
        except LessonQuizMapping.DoesNotExist:
            return None

    # check if user can access quiz based on if they completed previous lessons
    def check_quiz_access(self, user, quiz):
        from .models import Unit1
        
        mapping = self.get_lesson_mapping(quiz)
        
        # if quiz is not mapped to a lesson, deny access
        if not mapping:
            return False, "This quiz is not available yet"
        
        # always allows access to lesson 1 quizzes
        if mapping.lesson == 1:
            return True, None
        
        # retrieve unit (1) progress for this user
        unit_progress, created = Unit1.objects.get_or_create(
            user=user,
            defaults={'unit_name': f'Unit {mapping.unit}', 'unit_code': f'UNIT_{mapping.unit}'}
        )
        
        # check if previous lesson is completed 
        prev_lesson_field = f'lesson{mapping.lesson - 1}_completed'
        is_previous_complete = getattr(unit_progress, prev_lesson_field, False)
        
        if not is_previous_complete:
            return False, f"You must complete Lesson {mapping.lesson - 1} first"
        
        return True, None

    def retrieve(self, request, *args, **kwargs):
        quiz = self.get_object()
        can_access, error_msg = self.check_quiz_access(request.user, quiz)
        
        if not can_access:
            return Response({"error": error_msg}, status=status.HTTP_403_FORBIDDEN)
        
        return super().retrieve(request, *args, **kwargs)

    # api endpoint for submitting quiz answers
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        from .models import Unit1
        
        quiz = self.get_object()
        user = request.user
        answer_ids = request.data.get('answers', {})

        # Check if user can access this quiz
        can_access, error_msg = self.check_quiz_access(user, quiz)
        if not can_access:
            return Response({"error": error_msg}, status=status.HTTP_403_FORBIDDEN)

        # validating answer input is a list of choice IDs
        if not answer_ids or not isinstance(answer_ids, list):
            return Response({"error": "Invalid answers format. (must be a list of choice IDs)"}, status=status.HTTP_400_BAD_REQUEST)
        
        # calculates score by checking if choice IDs (from user) are the same as correct choice IDs for the questions
        correct_choices = Choice.objects.filter(question__quiz=quiz, is_correct=True).values_list('id', flat=True)

        score = sum(1 for answer_id in answer_ids if answer_id in correct_choices)

        num_questions = quiz.questions.count()

        # adds user's submission to the database
        submission = QuizSubmission.objects.create(quiz=quiz, user=request.user, score=score)

        # Update Unit1 progress if user passed (got all questions correct)
        if score == num_questions:
            mapping = self.get_lesson_mapping(quiz)
            if mapping:
                unit_progress, created = Unit1.objects.get_or_create(
                    user=user,
                    defaults={'unit_name': f'Unit {mapping.unit}', 'unit_code': f'UNIT_{mapping.unit}'}
                )
                lesson_field = f'lesson{mapping.lesson}_completed'
                setattr(unit_progress, lesson_field, True)
                unit_progress.save()

        # returns submission details, use passed to check if it's True/False a user passed
        return Response({
        'submission_id': submission.id, 
        'score': score, 
        'num_questions': num_questions,
        'passed': score == num_questions
        })

    # get user's unit 1 progress
    @action(detail=False, methods=['get'])
    def progress(self, request):
        try:
            unit1 = Unit1.objects.get(user=request.user)
        except Unit1.DoesNotExist:
            # create default progress if doesn't exist
            unit1 = Unit1.objects.create(
                user=request.user,
                unit_name='Unit 1',
                unit_code='UNIT_1'
            )
        
        serializer = Unit1Serializer(unit1)
        return Response(serializer.data)

# retrieves quiz submissions specific to user
class QuizSubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuizSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizSubmission.objects.filter(user=self.request.user).select_related('quiz').order_by('-submitted_at')
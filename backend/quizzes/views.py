# views.py - Update to work with your URL structure
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

    def get_lesson_mapping(self, quiz):
        try:
            mapping = LessonQuizMapping.objects.get(quiz=quiz)
            print(f"get_lesson_mapping: Quiz {quiz.id} -> Lesson {mapping.lesson}")
            return mapping
        except LessonQuizMapping.DoesNotExist:
            print(f"get_lesson_mapping: No mapping found for quiz {quiz.id}")
            return None

    def check_quiz_access(self, user, quiz):
        from .models import Unit1
        
        mapping = self.get_lesson_mapping(quiz)
        
        print(f"\n=== CHECK QUIZ ACCESS DEBUG ===")
        print(f"User: {user.username}")
        print(f"Quiz: {quiz.title}")
        print(f"Quiz ID: {quiz.id}")
        
        if mapping:
            print(f"Mapping found: Lesson {mapping.lesson}, Unit {mapping.unit}")
        else:
            print("No mapping found for this quiz")
            return False, "This quiz is not available yet"
        
        # always allows access to lesson 1 quizzes
        if mapping.lesson == 1:
            print("Lesson 1 - Always accessible")
            return True, None
        
        print(f"Checking if user can access lesson {mapping.lesson}")
        
        # Try to get Unit1 progress for this user
        try:
            unit_progress = Unit1.objects.get(user=user)
            print(f"✓ Unit1 found for user")
            print(f"  Lesson 1 completed: {unit_progress.lesson1_completed}")
            print(f"  Lesson 2 completed: {unit_progress.lesson2_completed}")
        except Unit1.DoesNotExist:
            print(f"✗ No Unit1 progress found for user")
            return False, f"You must complete Lesson {mapping.lesson - 1} first"
        
        # check if previous lesson is completed 
        prev_lesson_field = f'lesson{mapping.lesson - 1}_completed'
        is_previous_complete = getattr(unit_progress, prev_lesson_field, False)
        
        print(f"Checking previous lesson ({mapping.lesson - 1}) field: {prev_lesson_field}")
        print(f"Previous lesson completed: {is_previous_complete}")
        
        if not is_previous_complete:
            error_msg = f"You must complete Lesson {mapping.lesson - 1} first"
            print(f"✗ Access denied: {error_msg}")
            return False, error_msg
        
        print(f"✓ Access granted to lesson {mapping.lesson}")
        print("=== END ACCESS DEBUG ===")
        
        return True, None
    # GET /api/quizzes/<int:pk>/ - Get quiz by ID (lesson ID or quiz ID)
    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        
        # First, try to find quiz by lesson number
        try:
            lesson_id = int(pk)
            # Try to find mapping by lesson number
            try:
                mapping = LessonQuizMapping.objects.get(lesson=lesson_id)
                quiz = mapping.quiz
            except LessonQuizMapping.DoesNotExist:
                # If not found by lesson, try as quiz ID
                quiz = self.get_object()
        except (ValueError, KeyError):
            # If not a number, use as quiz ID
            quiz = self.get_object()
        
        # Check access permissions
        can_access, error_msg = self.check_quiz_access(request.user, quiz)
        
        if not can_access:
            return Response({"error": error_msg}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(quiz)
        return Response(serializer.data)

    # POST /api/quizzes/<int:pk>/submit/ - Submit quiz answers
    def submit(self, request, pk=None):
        from .models import Unit1
        
        # Try to find quiz by lesson ID first
        try:
            lesson_id = int(pk)
            try:
                mapping = LessonQuizMapping.objects.get(lesson=lesson_id)
                quiz = mapping.quiz
            except LessonQuizMapping.DoesNotExist:
                # If not found by lesson, try as quiz ID
                quiz = self.get_object()
        except (ValueError, KeyError):
            quiz = self.get_object()
        
        user = request.user
        answer_ids = request.data.get('answers', [])
        
        # Check if user can access this quiz
        can_access, error_msg = self.check_quiz_access(user, quiz)
        if not can_access:
            return Response({"error": error_msg}, status=status.HTTP_403_FORBIDDEN)

        # Validating answer input is a list of choice IDs
        if not answer_ids or not isinstance(answer_ids, list):
            return Response({"error": "Invalid answers format. Must be a list of choice IDs."}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Get all questions for this quiz
        questions = quiz.questions.all()
        num_questions = questions.count()
        
        if len(answer_ids) != num_questions:
            return Response({"error": f"Expected {num_questions} answers, got {len(answer_ids)}"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate score
        score = 0
        for i, question in enumerate(questions):
            try:
                selected_choice_id = answer_ids[i]
                selected_choice = Choice.objects.get(id=selected_choice_id, question=question)
                if selected_choice.is_correct:
                    score += 1
            except (IndexError, Choice.DoesNotExist):
                # If answer not provided or invalid choice, skip
                pass
        
        # Create submission record
        submission = QuizSubmission.objects.create(
            quiz=quiz, 
            user=user, 
            score=score,
            num_questions=num_questions
        )
        
        # Update Unit1 progress if user passed (got all questions correct)
        if score == num_questions:
            mapping = self.get_lesson_mapping(quiz)
            if mapping:
                unit_progress, created = Unit1.objects.get_or_create(
                    user=user,
                    defaults={
                        'unit_name': f'Unit {mapping.unit}', 
                        'unit_code': f'UNIT_{mapping.unit}'
                    }
                )
                lesson_field = f'lesson{mapping.lesson}_completed'
                setattr(unit_progress, lesson_field, True)
                unit_progress.save()
                
                # Also mark all previous lessons as completed if they're not already
                for prev_lesson in range(1, mapping.lesson):
                    prev_field = f'lesson{prev_lesson}_completed'
                    if not getattr(unit_progress, prev_field, False):
                        setattr(unit_progress, prev_field, True)
                unit_progress.save()
        
        # Return submission details
        return Response({
            'submission_id': submission.id, 
            'score': score, 
            'num_questions': num_questions,
            'passed': score == num_questions,
            'lesson_completed': score == num_questions
        })

    # GET /api/quizzes/progress/ - Get user's progress
    def progress(self, request):
        try:
            unit1 = Unit1.objects.get(user=request.user)
        except Unit1.DoesNotExist:
            # Create default progress if doesn't exist
            unit1 = Unit1.objects.create(
                user=request.user,
                unit_name='Unit 1',
                unit_code='UNIT_1'
            )
        
        serializer = Unit1Serializer(unit1)
        return Response(serializer.data)

    # POST /api/quizzes/mark-complete/ - Manually mark lesson as complete
    # Add this method to your QuizViewSet
    def mark_complete(self, request):
        lesson_id = request.data.get('lesson_id')
        
        if not lesson_id:
            return Response({"error": "Lesson ID required"}, status=400)
        
        try:
            lesson_id = int(lesson_id)
            
            # Get or create Unit1 progress
            unit_progress, created = Unit1.objects.get_or_create(
                user=request.user,
                defaults={
                    'unit_name': 'Unit 1',
                    'unit_code': 'UNIT_1'
                }
            )
            
            # Check if lesson field exists
            lesson_field = f'lesson{lesson_id}_completed'
            if hasattr(unit_progress, lesson_field):
                setattr(unit_progress, lesson_field, True)
                unit_progress.save()
                
                # Also mark all previous lessons as completed
                for prev_lesson in range(1, lesson_id):
                    prev_field = f'lesson{prev_lesson}_completed'
                    if not getattr(unit_progress, prev_field, False):
                        setattr(unit_progress, prev_field, True)
                unit_progress.save()
                
                return Response({
                    "success": True, 
                    "message": f"Lesson {lesson_id} marked as complete"
                })
            else:
                return Response({"error": f"Invalid lesson ID: {lesson_id}"}, status=400)
                
        except ValueError:
            return Response({"error": "Invalid lesson ID format"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class QuizSubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuizSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizSubmission.objects.filter(user=self.request.user).select_related('quiz').order_by('-submitted_at')
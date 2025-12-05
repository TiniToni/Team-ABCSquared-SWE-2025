import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizForLesson, submitQuiz } from '../Api.js';
import { UserContext } from '../context/UserContext.jsx';
import "./Quiz.css";

export default function Quiz() {
  const { id } = useParams();
  const lessonId = Number(id) || 1;
  const navigate = useNavigate();
  const { markLessonComplete, completedLessons } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    setSubmissionResult(null);
    
    getQuizForLesson(lessonId)
      .then((res) => {
        if (!mounted) return;
        
        const quizData = res.data;
        setQuiz(quizData);
        
      
        const initialAnswers = {};
        if (quizData.questions) {
          quizData.questions.forEach(question => {
            initialAnswers[question.id] = null;
          });
        }
        setSelectedAnswers(initialAnswers);
        
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        
        if (err.response?.status === 403) {
          setError(err.response.data.error || "You don't have access to this quiz. Complete the previous lesson first.");
        } else if (err.response?.status === 404) {
          setError(`No quiz found for Lesson ${lessonId}.`);
        } else {
          setError("Failed to load quiz. Please try again later.");
        }
        
        setLoading(false);
      });

    return () => { mounted = false; };
  }, [lessonId]);

  const handleSelectAnswer = (questionId, choiceId) => {
    if (submissionResult) return; 
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    const unansweredQuestions = Object.values(selectedAnswers).some(answer => answer === null);
    if (unansweredQuestions) {
      setError('Please answer all questions before submitting.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const answers = Object.values(selectedAnswers);
      
     
      const response = await submitQuiz(lessonId, answers);
      const result = response.data;
      
      setSubmissionResult(result);
      
      
      if (result.passed) {
        markLessonComplete(lessonId);
        
        
        setTimeout(() => {
          const nextLesson = lessonId + 1;
          if (nextLesson <= 9) {
            navigate(`/lesson/${nextLesson}`);
          } else {
            navigate('/dashboard');
          }
        }, 3000);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.error || "Access denied. Complete the previous lesson first.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || "Invalid submission format.");
      } else {
        setError("Failed to submit quiz. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const selectedChoiceId = selectedAnswers[question.id];
    
    return (
      <div key={question.id} className="question-card">
        <h4 className="question-number">Question {index + 1}</h4>
        <p className="question-text">{question.text}</p>
        
        <div className="choices-grid">
          {question.choices && question.choices.map(choice => (
            <div 
              key={choice.id}
              className={`choice-item ${selectedChoiceId === choice.id ? 'selected' : ''}`}
              onClick={() => !submissionResult && handleSelectAnswer(question.id, choice.id)}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={selectedChoiceId === choice.id}
                onChange={() => {}}
                className="choice-radio"
                disabled={!!submissionResult}
              />
              <span className="choice-text">{choice.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="quiz-error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to Load Quiz</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate(`/lesson/${lessonId}`)}
          className="back-button"
        >
          Back to Lesson
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>{quiz?.title || `Quiz - Lesson ${lessonId}`}</h2>
          {quiz?.description && (
            <p className="quiz-description">{quiz.description}</p>
          )}
          {completedLessons.includes(lessonId) && (
            <div className="already-completed">
              ✓ You've already completed this lesson
            </div>
          )}
        </div>

        {submissionResult ? (
          <div className="submission-results">
            <div className={`result-card ${submissionResult.passed ? 'passed' : 'failed'}`}>
              <h3>{submissionResult.passed ? '🎉 Quiz Passed!' : '📝 Quiz Results'}</h3>
              <div className="score-display">
                <span className="score-number">{submissionResult.score}</span>
                <span className="score-divider">/</span>
                <span className="total-questions">{submissionResult.num_questions}</span>
              </div>
              <p className="result-message">
                {submissionResult.passed 
                  ? `Excellent! You scored ${submissionResult.score} out of ${submissionResult.num_questions}.`
                  : `You scored ${submissionResult.score} out of ${submissionResult.num_questions}. Need ${submissionResult.num_questions} correct to pass.`
                }
              </p>
              
              {submissionResult.passed ? (
                <>
                  <p className="success-message">Lesson {lessonId} marked as complete!</p>
                  <div className="auto-navigate">
                    Redirecting to next lesson in 3 seconds...
                  </div>
                </>
              ) : (
                <div className="retry-options">
                  <button 
                    onClick={() => {
                      setSubmissionResult(null);
                      // Reset answers
                      const resetAnswers = {};
                      quiz.questions.forEach(q => {
                        resetAnswers[q.id] = null;
                      });
                      setSelectedAnswers(resetAnswers);
                    }}
                    className="retry-button"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => navigate(`/lesson/${lessonId}`)}
                    className="review-button"
                  >
                    Review Lesson
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="quiz-form">
            <div className="questions-container">
              {quiz?.questions?.map((question, index) => 
                renderQuestion(question, index)
              )}
            </div>
            
            {error && <div className="form-error">{error}</div>}
            
            <div className="submit-section">
              <button 
                type="submit" 
                className="submit-quiz-button"
                disabled={isSubmitting || !quiz?.questions?.length}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
              <button 
                type="button"
                onClick={() => navigate(`/lesson/${lessonId}`)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
            
            <div className="quiz-info">
              <p>✓ Answer all questions to submit</p>
              <p>✓ You need all correct answers to pass</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
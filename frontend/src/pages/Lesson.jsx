import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { VIDEO_IDS } from '../config/lessonVideos.js';
import "./Lesson.css";

const TOTAL_LESSONS = 9;

export default function Lesson() {
  const { id } = useParams();
  const lessonId = Number(id) || 1;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { 
    currentLesson, 
    setCurrentLesson, 
    completedLessons, 
    isLoading 
  } = useContext(UserContext);
  
  const [accessError, setAccessError] = useState('');

  useEffect(() => {
    if (setCurrentLesson) setCurrentLesson(lessonId);
    
    // Check if user can access this lesson
    // Lesson 1 is always accessible
    if (lessonId === 1) {
      setAccessError('');
      return;
    }
    
    // For other lessons, check if previous lesson is completed
    if (!isLoading && !completedLessons.includes(lessonId - 1)) {
      setAccessError(`You must complete Lesson ${lessonId - 1} first.`);
    } else {
      setAccessError('');
    }
  }, [lessonId, setCurrentLesson, completedLessons, isLoading]);

  const videoIdFromQuery = searchParams.get('v');
  const videoId = videoIdFromQuery || VIDEO_IDS[lessonId - 1] || VIDEO_IDS[0];

  const percent = Math.round((lessonId / TOTAL_LESSONS) * 100);

  const goToQuiz = () => { 
    if (!accessError) {
      navigate(`/quiz/${lessonId}`); 
    }
  };
  
  const goNextLesson = () => { 
    if (lessonId < TOTAL_LESSONS && completedLessons.includes(lessonId)) {
      navigate(`/lesson/${lessonId + 1}`); 
    } else if (lessonId < TOTAL_LESSONS) {
      setAccessError(`Complete Lesson ${lessonId} to unlock Lesson ${lessonId + 1}`);
    }
  };
  
  const goPrevLesson = () => { 
    navigate(`/lesson/${Math.max(1, lessonId - 1)}`); 
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="lesson-wrapper">
      <div className="progress-container">
        <div className="progress-label">
          <h3>Lesson {lessonId} / {TOTAL_LESSONS}</h3>
          {completedLessons.includes(lessonId) && (
            <span className="completed-badge">✓ Completed</span>
          )}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
        
        {accessError && (
          <div className="access-error">{accessError}</div>
        )}
      </div>

      <div className="video-box">
        {!accessError || lessonId === 1 ? (
          <>
            <div className="video-container">
              <iframe
                title={`lesson-video-${lessonId}`}
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="button-row">
              <button 
                className="nav-btn left" 
                onClick={goPrevLesson}
                disabled={lessonId === 1}
              >
                Previous Lesson
              </button>
              
              <button 
                className="quiz-btn" 
                onClick={goToQuiz}
                disabled={!!accessError && lessonId !== 1}
              >
                {completedLessons.includes(lessonId) ? 'Retake Quiz' : 'Take Quiz'}
              </button>
              
              <button 
                className="nav-btn right" 
                onClick={goNextLesson}
                disabled={lessonId === TOTAL_LESSONS || !completedLessons.includes(lessonId)}
              >
                Next Lesson
              </button>
            </div>
          </>
        ) : (
          <div className="locked-lesson">
            <div className="lock-icon">🔒</div>
            <h3>Lesson {lessonId} is Locked</h3>
            <p>You need to complete Lesson {lessonId - 1} and pass its quiz first.</p>
            <button 
              onClick={() => navigate(`/lesson/${lessonId - 1}`)}
              className="nav-btn"
            >
              Go to Lesson {lessonId - 1}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useContext, useEffect } from 'react';
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
	const { currentLesson, setCurrentLesson } = useContext(UserContext);

	useEffect(() => {
		if (setCurrentLesson) setCurrentLesson(lessonId);
	}, [lessonId, setCurrentLesson]);

	const videoIdFromQuery = searchParams.get('v');
	const videoId = videoIdFromQuery || VIDEO_IDS[lessonId - 1] || VIDEO_IDS[0];

	const percent = Math.round((lessonId / TOTAL_LESSONS) * 100);

	function goToQuiz() { navigate(`/quiz/${lessonId}`); }
	function goNextLesson() { navigate(`/lesson/${Math.min(TOTAL_LESSONS, lessonId + 1)}`); }
	function goPrevLesson() { navigate(`/lesson/${Math.max(1, lessonId - 1)}`); }

	return (
		<div className="lesson-wrapper">

			<div className="progress-container">
				<div className="progress-label">
					<h3>Lesson {lessonId} / {TOTAL_LESSONS}</h3>
				</div>
				<div className="progress-bar">
					<div className="progress-fill" style={{ width: `${percent}%` }}></div>
				</div>
			</div>

			<div className="video-box">

				<div className="video-container">
					<iframe
						title={`lesson-video-${lessonId}`}
						src={`https://www.youtube.com/embed/${videoId}`}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>

				<div className="button-row">
					<button className="nav-btn left" onClick={goPrevLesson}>Previous Lesson</button>
					<button className="quiz-btn" onClick={goToQuiz}>Take Quiz</button>
					<button className="nav-btn right" onClick={goNextLesson}>Next Lesson</button>
				</div>

			</div>
		</div>
	);
}

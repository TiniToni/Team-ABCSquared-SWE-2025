import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { VIDEO_IDS } from '../config/lessonVideos.js';

const TOTAL_LESSONS = 9;export default function Lesson() {
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

	function goToQuiz() {
		navigate(`/quiz/${lessonId}`);
	}

	function goNextLesson() {
		const next = Math.min(TOTAL_LESSONS, lessonId + 1);
		navigate(`/lesson/${next}`);
	}

	return (
		<div style={{ padding: 16 }}>
			<div style={{ marginBottom: 12 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div>Lesson {lessonId} / {TOTAL_LESSONS}</div>
					<div style={{ width: 300, background: '#eee', height: 12, borderRadius: 6 }}>
						<div style={{ width: `${percent}%`, height: 12, background: '#4caf50', borderRadius: 6 }} />
					</div>
				</div>
			</div>

			<div style={{ maxWidth: 900, margin: '0 auto' }}>
				<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
					<iframe
						title={`lesson-video-${lessonId}`}
						src={`https://www.youtube.com/embed/${videoId}`}
						style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>

				<div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
					<button onClick={goToQuiz} style={{ padding: '8px 12px' }}>Take Quiz</button>
					<button onClick={goNextLesson} style={{ padding: '8px 12px' }}>Next Lesson</button>
				</div>
			</div>
		</div>
	);
}

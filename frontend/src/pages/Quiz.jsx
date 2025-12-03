import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizForLesson, submitQuiz } from '../Api.js';
import { UserContext } from '../context/UserContext.jsx';

export default function Quiz() {
	const { id } = useParams();
	const lessonId = Number(id) || 1;
	const navigate = useNavigate();
	const { markLessonComplete } = useContext(UserContext);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [quiz, setQuiz] = useState(null);
	const [selected, setSelected] = useState(null);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		getQuizForLesson(lessonId)
			.then((res) => {
				if (!mounted) return;
				setQuiz(res.data);
				setLoading(false);
			})
			.catch(() => {
				// fallback mock quiz if backend isn't available
				setQuiz({
					question: `Sample question for lesson ${lessonId}: Which cooking technique was shown?`,
					choices: ['Sauté', 'Boil', 'Bake', 'Steam'],
					correctIndex: 0,
				});
				setLoading(false);
			});

		return () => { mounted = false; };
	}, [lessonId]);

	function handleSubmit(e) {
		e.preventDefault();
		if (selected === null) {
			setError('Please select an answer.');
			return;
		}

		setError(null);

		// Try to submit to backend; if it fails, evaluate locally
		submitQuiz(lessonId, { answerIndex: selected })
			.then((res) => {
				// if backend returns score/result, use it. Otherwise mark complete and navigate.
				markLessonComplete(lessonId);
				const next = lessonId + 1;
				if (next <= 9) navigate(`/lesson/${next}`);
				else navigate('/');
			})
			.catch(() => {
				// fallback local check
				if (quiz && typeof quiz.correctIndex !== 'undefined') {
					const ok = selected === quiz.correctIndex;
					// you could show score; for now, mark completed and continue
				}
				markLessonComplete(lessonId);
				const next = lessonId + 1;
				if (next <= 9) navigate(`/lesson/${next}`);
				else navigate('/');
			});
	}

	if (loading) return <div style={{ padding: 16 }}>Loading quiz…</div>;

	return (
		<div style={{ padding: 16 }}>
			<h3>Quiz for Lesson {lessonId}</h3>
			{quiz ? (
				<form onSubmit={handleSubmit}>
					<p>{quiz.question}</p>
					<div>
						{quiz.choices.map((c, i) => (
							<div key={i} style={{ marginBottom: 8 }}>
								<label>
									<input type="radio" name="choice" checked={selected === i} onChange={() => setSelected(i)} /> {c}
								</label>
							</div>
						))}
					</div>

					{error && <div style={{ color: 'red' }}>{error}</div>}

					<div style={{ marginTop: 12 }}>
						<button type="submit" style={{ padding: '8px 12px' }}>Submit</button>
					</div>
				</form>
			) : (
				<div>No quiz available for this lesson.</div>
			)}
		</div>
	);
}

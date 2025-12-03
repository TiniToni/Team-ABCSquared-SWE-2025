import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizForLesson, submitQuiz } from '../Api.js';
import { UserContext } from '../context/UserContext.jsx';
import "./Quiz.css";

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
				else navigate('/dashboard');
			});
	}

	if (loading) return <div className="quiz-loading">Loading quiz…</div>;

	return (
		<div className="quiz-page">
			<div className="quiz-card">

				<h3 className="quiz-title">Quiz for Lesson {lessonId}</h3>

				{quiz ? (
					<form onSubmit={handleSubmit} className="quiz-form">

						{/* question */}
						<p className="quiz-question">{quiz.question}</p>

						{/*answer */}
						<div className="quiz-choices">
							{quiz.choices.map((c, i) => (
								<label 
									key={i}
									className={`choice-option ${selected === i ? "selected" : ""}`}
								>
									<input 
										type="radio" 
										name="choice" 
										checked={selected === i} 
										onChange={() => setSelected(i)} 
									/> 
									<span>{c}</span>
								</label>
							))}
						</div>

						{/* Error  */}
						{error && <div className="quiz-error">{error}</div>}

						{/*submit */}
						<div className="submit-area">
							<button type="submit" className="submit-btn">Submit</button>
						</div>

					</form>
				) : (
					<div>No quiz available for this lesson.</div>
				)}
			</div>
		</div>
	);
}

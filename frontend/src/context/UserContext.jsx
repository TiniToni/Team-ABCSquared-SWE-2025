import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(() => {
    try {
      const v = localStorage.getItem('currentLesson');
      return v ? Number(v) : 1;
    } catch (e) {
      return 1;
    }
  });

  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const v = localStorage.getItem('completedLessons');
      return v ? JSON.parse(v) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('currentLesson', String(currentLesson)); } catch (e) {}
  }, [currentLesson]);

  useEffect(() => {
    try { localStorage.setItem('completedLessons', JSON.stringify(completedLessons)); } catch (e) {}
  }, [completedLessons]);

  function markLessonComplete(lessonId) {
    setCompletedLessons((prev) => {
      const id = Number(lessonId);
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }

  return (
    <UserContext.Provider value={{ user, setUser, currentLesson, setCurrentLesson, completedLessons, markLessonComplete }}>
      {children}
    </UserContext.Provider>
  );
}

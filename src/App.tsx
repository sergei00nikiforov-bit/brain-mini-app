
import { useEffect, useState } from "react";
import { tasks } from "./tasks";
import { getTodayIndex } from "./utils";
import "./App.css";
import { initTelegram } from "./telegram";
useEffect(() => {
  initTelegram();
}, []);

type Result = {
  answered: boolean;
  correct: boolean;
};

function App() {
  const todayIndex = getTodayIndex(tasks.length);
  const task = tasks[todayIndex];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [result, setResult] = useState<Result>({
    answered: false,
    correct: false,
  });

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedXp = localStorage.getItem("brain_xp");
    const savedStreak = localStorage.getItem("brain_streak");

    if (savedXp) {
      setXp(Number(savedXp));
    }

    if (savedStreak) {
      setStreak(Number(savedStreak));
    }

    const completedToday = localStorage.getItem("brain_completed_today");

    if (completedToday === new Date().toDateString()) {
      const savedCorrect = localStorage.getItem("brain_today_correct");

      setResult({
        answered: true,
        correct: savedCorrect === "true",
      });
    }
  }, []);

  function answer(index: number) {
    if (result.answered) return;

    const correct = index === task.correctAnswer;

    setSelectedAnswer(index);

    setResult({
      answered: true,
      correct,
    });

    if (correct) {
      const newXp = xp + 10;

      setXp(newXp);

      localStorage.setItem("brain_xp", String(newXp));
    }

    const today = new Date().toDateString();

    localStorage.setItem("brain_completed_today", today);
    localStorage.setItem("brain_today_correct", String(correct));

    const previousDate = localStorage.getItem("brain_previous_date");

    if (previousDate !== today) {
      const newStreak = streak + 1;

      setStreak(newStreak);

      localStorage.setItem(
        "brain_streak",
        String(newStreak)
      );

      localStorage.setItem(
        "brain_previous_date",
        today
      );
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div className="logo">BRAIN</div>

        <div className="stats">
          <span>🔥 {streak}</span>
          <span>XP {xp}</span>
        </div>
      </header>

      <section className="content">
        <div className="day">
          День {todayIndex + 1}
        </div>

        <div className="category">
          {task.category}
        </div>

        <h1>
          {task.question}
        </h1>

        <div className="answers">
          {task.options.map((option, index) => {
            let className = "answer";

            if (
              result.answered &&
              index === task.correctAnswer
            ) {
              className += " correct";
            }

            if (
              result.answered &&
              index === selectedAnswer &&
              index !== task.correctAnswer
            ) {
              className += " wrong";
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => answer(index)}
                disabled={result.answered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {result.answered && (
          <div className="result">
            <div className="result-title">
              {result.correct
                ? "✓ Правильно"
                : "✕ Неправильно"}
            </div>

            {result.correct && (
              <div className="xp-earned">
                +10 XP
              </div>
            )}

            <p>{task.explanation}</p>
          </div>
        )}
      </section>

      <footer>
        <span>Одна задача в день.</span>
        <span>Становись умнее.</span>
      </footer>
    </main>
  );
}

export default App;
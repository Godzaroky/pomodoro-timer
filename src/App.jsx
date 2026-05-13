import { useState, useEffect, useRef } from "react";

const WORK_TIME = 1500;
const BREAK_TIME = 300;

function App() {
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState("work");
    const [sessions, setSessions] = useState([]);

    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isRunning, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            if (mode === "work") {
                setSessions(prev => [...prev, {
                    id: Date.now(),
                    type: "work",
                    duration: WORK_TIME,
                    completedAt: new Date()
                }]);
            }
            setMode(prev => prev === "work" ? "break" : "work");
            setTimeLeft(mode === "work" ? BREAK_TIME : WORK_TIME);
            setIsRunning(true);
        }
    }, [timeLeft]);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    function toggleTimer() {
        setIsRunning(prev => !prev);
    }

    function resetTimer() {
        clearInterval(timerRef.current);
        setTimeLeft(WORK_TIME);
        setIsRunning(false);
        setMode("work");
        setSessions([]);
    }

    return (
        <div>
            <h2>{mode === "work" ? "Trabajo" : "Descanso"}</h2>
            <h1>{formatTime(timeLeft)}</h1>
            <button onClick={toggleTimer}>{isRunning ? "Pausa" : "Iniciar"}</button>
            <button onClick={resetTimer}>Reiniciar</button>

            <ul>
                {sessions.map((session, index) => (
                    <li key={session.id}>
                        Sesión {index + 1} — {formatTime(session.duration)} — {session.completedAt.toLocaleTimeString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

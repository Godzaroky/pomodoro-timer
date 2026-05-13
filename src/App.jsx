import { useState, useEffect, useRef } from "react";

const WORK_TIME = 1500;
const BREAK_TIME = 300;

function App() {
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState("work");
    const [sessions, setSessions] = useState([]);

    // 1. Estados para configuración
    const [workMinutes, setWorkMinutes] = useState(WORK_TIME / 60);
    const [breakMinutes, setBreakMinutes] = useState(BREAK_TIME / 60);

    const timerRef = useRef(null);

    // Timer principal
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, timeLeft]);

    // Ciclo automático al llegar a 0
    useEffect(() => {
        if (timeLeft === 0) {
            if (mode === "work") {
                setSessions(prev => [...prev, {
                    id: Date.now(),
                    type: "work",
                    duration: workMinutes * 60,
                    completedAt: new Date()
                }]);
            }
            setMode(prev => prev === "work" ? "break" : "work");
            setTimeLeft(mode === "work" ? breakMinutes * 60 : workMinutes * 60);
            setIsRunning(true);
        }
    }, [timeLeft]);

    // 3. Sonido al llegar a 0
    useEffect(() => {
        if (timeLeft === 0) {
            try {
                new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
            } catch (e) {
                console.error("Error al reproducir sonido:", e);
            }
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
        setTimeLeft(workMinutes * 60);
        setIsRunning(false);
        setMode("work");
        setSessions([]);
    }

    // 1. Handlers para inputs
    function handleWorkMinutes(e) {
        const value = Number(e.target.value);
        setWorkMinutes(value);
        if (!isRunning && mode === "work") {
            setTimeLeft(value * 60);
        }
    }

    function handleBreakMinutes(e) {
        const value = Number(e.target.value);
        setBreakMinutes(value);
        if (!isRunning && mode === "break") {
            setTimeLeft(value * 60);
        }
    }

    // 2. Barra de progreso
    const totalTime = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    // 4. Estadísticas derivadas
    const workSessions = sessions.filter(s => s.type === "work");
    const totalWorkSeconds = workSessions.reduce((acc, s) => acc + s.duration, 0);

    // 5. Guardar sesión parcial
    function savePartialSession() {
        const elapsed = totalTime - timeLeft;
        if (elapsed === 0) return;
        setSessions(prev => [...prev, {
            id: Date.now(),
            type: "work (parcial)",
            duration: elapsed,
            completedAt: new Date()
        }]);
    }

    return (
        <div>
            <div>
                <label>
                    Trabajo (min):
                    <input
                        type="number"
                        min={1}
                        max={60}
                        value={workMinutes}
                        disabled={isRunning}
                        onChange={handleWorkMinutes}
                    />
                </label>
                <label>
                    Descanso (min):
                    <input
                        type="number"
                        min={1}
                        max={60}
                        value={breakMinutes}
                        disabled={isRunning}
                        onChange={handleBreakMinutes}
                    />
                </label>
            </div>

            {/* Modo y timer */}
            <h2>{mode === "work" ? "Trabajo" : "Descanso"}</h2>
            <h1>{formatTime(timeLeft)}</h1>

            {/* 2. Barra de progreso */}
            <div style={{ width: "300px", height: "12px", backgroundColor: "#ddd", borderRadius: "6px" }}>
                <div style={{
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: mode === "work" ? "#e74c3c" : "#2ecc71",
                    borderRadius: "6px",
                    transition: "width 1s linear"
                }} />
            </div>

            {/* Botones */}
            <button onClick={toggleTimer}>{isRunning ? "Pausa" : "Iniciar"}</button>
            <button onClick={resetTimer}>Reiniciar</button>
            {/* 5. Guardar sesión parcial */}
            <button onClick={savePartialSession} disabled={!isRunning && timeLeft === totalTime}>
                Guardar sesión
            </button>

            {/* 4. Estadísticas */}
            <div>
                <p>Sesiones completadas: {workSessions.length}</p>
                <p>Tiempo total de trabajo: {formatTime(totalWorkSeconds)}</p>
            </div>

            {/* Historial */}
            <ul>
                {sessions.map((session, index) => (
                    <li key={session.id}>
                        Sesión {index + 1} — {session.type} — {formatTime(session.duration)} — {session.completedAt.toLocaleTimeString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

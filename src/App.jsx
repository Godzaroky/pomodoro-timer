import { useState, useEffect, useRef } from "react";

function App() {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos en segundos
    const [isRunning, setIsRunning] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }

        if (timeLeft === 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isRunning, timeLeft]);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs =  seconds % 60;

        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = secs.toString().padStart(2, "0");

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    function toggleTimer() {
        setIsRunning(prev => !prev);
    }

    function resetTimer() {
        clearInterval(timerRef.current);
        setTimeLeft(25 * 60);
        setIsRunning(false);
    }

    return (
        <div>
            <h1>{formatTime(timeLeft)}</h1>
            <button onClick = {toggleTimer}> {isRunning ? "Pausa":"Iniciar"}</button>
            <button onClick = {resetTimer}>Reiniciar</button>
        </div>
    );
}

export default App
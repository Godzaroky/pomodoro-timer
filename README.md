# Pomodoro Timer

Un temporizador Pomodoro construido con React que incluye ciclos automáticos, estadísticas de sesiones, barra de progreso y configuración personalizable.

---

## Características

- **Ciclo automático** — al terminar una sesión de trabajo, cambia a descanso y viceversa sin intervención del usuario
- **Configuración personalizable** — ajusta los minutos de trabajo (1–60) y descanso (1–60) desde la interfaz
- **Barra de progreso** — visualiza el tiempo transcurrido en tiempo real; cambia de color según el modo
- **Sonido de alerta** — reproduce un beep al finalizar cada sesión
- **Historial de sesiones** — registro de todas las sesiones completadas con duración y hora de finalización
- **Sesión parcial** — guarda el progreso de una sesión en curso sin detener el timer
- **Estadísticas** — muestra el total de sesiones de trabajo completadas y el tiempo acumulado

---

## Instalación y uso

```bash
# Clona el repositorio
git clone <url-del-repo>

# Entra al directorio
cd pomodoro-timer

# Instala dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## Uso

1. **Configura** los minutos de trabajo y descanso en los inputs superiores (solo disponibles cuando el timer está detenido)
2. Presiona **Iniciar** para arrancar el temporizador
3. Presiona **Pausa** para detenerlo temporalmente
4. Presiona **Guardar sesión** para registrar el tiempo transcurrido sin interrumpir el timer
5. Presiona **Reiniciar** para volver al estado inicial

---

## Estructura del proyecto

```
pomodoro-timer/
├── src/
│   └── App.jsx       # Componente principal con toda la lógica
├── public/
├── index.html
├── package.json
└── README.md
```

---

## Lógica principal

### Estados

| Estado | Tipo | Descripción |
|---|---|---|
| `timeLeft` | `number` | Segundos restantes en la sesión actual |
| `isRunning` | `boolean` | Indica si el timer está corriendo |
| `mode` | `string` | Modo actual: `"work"` o `"break"` |
| `sessions` | `array` | Historial de sesiones completadas o parciales |
| `workMinutes` | `number` | Duración configurada para trabajo (en minutos) |
| `breakMinutes` | `number` | Duración configurada para descanso (en minutos) |

### Efectos (useEffect)

- **Timer principal** — crea y limpia un `setInterval` cada segundo cuando `isRunning` es `true`
- **Ciclo automático** — detecta `timeLeft === 0`, guarda la sesión, cambia el modo y reinicia el contador
- **Sonido** — reproduce un beep cuando `timeLeft === 0`

### Valores derivados

```js
const workSessions = sessions.filter(s => s.type === "work");
const totalWorkSeconds = workSessions.reduce((acc, s) => acc + s.duration, 0);
const progress = ((totalTime - timeLeft) / totalTime) * 100;
```

---

## Tecnologías

- [React](https://react.dev/) — librería de UI
- [Vite](https://vitejs.dev/) — bundler y servidor de desarrollo
- `useState`, `useEffect`, `useRef` — hooks nativos de React

---

## Estructura de una sesión

```js
{
  id: Date.now(),           // Identificador único
  type: "work",             // "work", "break" o "work (parcial)"
  duration: 1500,           // Duración en segundos
  completedAt: new Date()   // Fecha y hora de finalización
}
```

---

import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TimerMode {
  label: string;
  work: number;
  shortBreak: number;
  longBreak: number;
}

const MODES: TimerMode[] = [
  { label: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15 },
  { label: 'Deep Work', work: 50, shortBreak: 10, longBreak: 20 },
  { label: 'Short Burst', work: 15, shortBreak: 3, longBreak: 10 },
  { label: 'Custom', work: 30, shortBreak: 5, longBreak: 15 },
];

const SOUNDS = [
  { label: '🔕 Silent', value: 'none' },
  { label: '🌊 Ocean Waves', value: 'ocean' },
  { label: '☕ Café Noise', value: 'cafe' },
  { label: '🌧 Rain', value: 'rain' },
  { label: '🔔 Bell', value: 'bell' },
];

type Phase = 'work' | 'shortBreak' | 'longBreak';

function CircleTimer({ pct, phase, remaining }: { pct: number; phase: Phase; remaining: number }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct);
  const color = phase === 'work' ? '#7c3aed' : phase === 'shortBreak' ? '#0284c7' : '#16a34a';
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
      <svg width={200} height={200} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={100} cy={100} r={r} fill="none" stroke="var(--border)" strokeWidth={10} />
        <circle cx={100} cy={100} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '.1em' }}>
          {phase === 'work' ? '🎯 Focus' : phase === 'shortBreak' ? '☕ Short Break' : '🌿 Long Break'}
        </div>
        <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--text)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginTop: 4 }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

export function StudyTimer() {
  const [selectedMode, setSelectedMode] = useState(0);
  const [customWork, setCustomWork] = useState('30');
  const [customShort, setCustomShort] = useState('5');
  const [customLong, setCustomLong] = useState('15');
  const [phase, setPhase] = useState<Phase>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState<number>(25 * 60);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
  const [, setSessionCount] = useState(0);
  const [sound, setSound] = useState('none');
  const [streakDays] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPhaseRef = useRef<Phase>('work');

  const mode = selectedMode < 3 ? MODES[selectedMode] : {
    label: 'Custom',
    work: parseInt(customWork) || 30,
    shortBreak: parseInt(customShort) || 5,
    longBreak: parseInt(customLong) || 15,
  };

  const totalForPhase = (phase === 'work' ? mode.work : phase === 'shortBreak' ? mode.shortBreak : mode.longBreak) * 60;
  const pct = 1 - remaining / totalForPhase;

  const playNotification = useCallback(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('⏰ Timer Complete!', { body: phase === 'work' ? 'Time for a break!' : 'Back to work!' });
    }
    // Simple audio beep
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = phase === 'work' ? 600 : 800;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.8);
    } catch (_) { /* empty */ }
  }, [phase]);

  const switchPhase = useCallback((newPhase: Phase) => {
    setPhase(newPhase);
    lastPhaseRef.current = newPhase;
    const secs = (newPhase === 'work' ? mode.work : newPhase === 'shortBreak' ? mode.shortBreak : mode.longBreak) * 60;
    setRemaining(secs);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    if (!isRunning) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          playNotification();
          if (lastPhaseRef.current === 'work') {
            setTotalFocusSeconds(s => s + totalForPhase);
            setPomodoroCount(c => {
              const next = c + 1;
              if (next % 4 === 0) { switchPhase('longBreak'); setSessionCount(s => s + 1); }
              else switchPhase('shortBreak');
              return next;
            });
          } else {
            switchPhase('work');
          }
          return 0;
        }
        if (lastPhaseRef.current === 'work') setTotalFocusSeconds(s => s + 1);
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, playNotification, switchPhase, totalForPhase]);

  const reset = () => {
    setIsRunning(false);
    setPhase('work');
    lastPhaseRef.current = 'work';
    setRemaining(mode.work * 60);
  };

  const requestNotif = () => {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  };

  const focusHours = Math.floor(totalFocusSeconds / 3600);
  const focusMins = Math.floor((totalFocusSeconds % 3600) / 60);


  const inp = { padding: '8px 10px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text)', outline: 'none', width: '100%' } as React.CSSProperties;

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Timer Settings"
      inputContent={<>
      {/* Mode selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        {MODES.map((m, i) => (
          <button key={m.label} onClick={() => { setSelectedMode(i); reset(); }}
            style={{ padding: '8px 6px', borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1.5px solid',
              borderColor: selectedMode === i ? 'var(--brand)' : 'var(--border)',
              background: selectedMode === i ? 'var(--brand-l)' : 'var(--surface)',
              color: selectedMode === i ? 'var(--brand)' : 'var(--text3)' }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Custom inputs */}
      {selectedMode === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[['Focus (min)', customWork, setCustomWork], ['Short Break', customShort, setCustomShort], ['Long Break', customLong, setCustomLong]].map(([l, v, fn]: any) => (
            <div key={l as string}>
              <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>{l}</label>
              <input type="number" style={inp} value={v as string} onChange={e => { fn(e.target.value); reset(); }} min="1" max="120" />
            </div>
          ))}
        </div>
      )}

      {/* Phase selector */}
      <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 10, border: '1px solid var(--border)' }}>
        {([['work', '🎯 Focus'], ['shortBreak', '☕ Short'], ['longBreak', '🌿 Long']] as [Phase, string][]).map(([p, l]) => (
          <button key={p} onClick={() => switchPhase(p)}
            style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: phase === p ? 'var(--brand)' : 'transparent',
              color: phase === p ? '#fff' : 'var(--text3)', border: 'none' }}>
            {l}
          </button>
        ))}
      </div>

      </>
      }
      resultContent={<>
      {/* Circle Timer */}
      <CircleTimer pct={pct} phase={phase} remaining={remaining} />

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={() => { requestNotif(); setIsRunning(r => !r); }}
          style={{ padding: '14px 36px', borderRadius: 50, fontSize: 16, fontWeight: 800, cursor: 'pointer', border: 'none',
            background: isRunning ? '#7c3aed' : 'var(--brand)', color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,.3)',
            transition: 'all .2s' }}>
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={reset} style={{ padding: '14px 20px', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text2)', transition: 'all .2s' }}>
          ↺ Reset
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { label: 'Pomodoros', value: pomodoroCount, icon: '🍅', color: '#dc2626' },
          { label: 'Focus Time', value: `${focusHours}h ${focusMins}m`, icon: '⏱', color: '#7c3aed' },
          { label: 'Study Streak', value: `${streakDays} days`, icon: '🔥', color: '#d97706' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 18 }}>{icon}</div>
            <div style={{ fontSize: 17, fontWeight: 900, color, marginTop: 4 }}>{value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Sound selector */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Background Sound</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SOUNDS.map(s => (
            <button key={s.value} onClick={() => setSound(s.value)}
              style={{ padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                borderColor: sound === s.value ? 'var(--brand)' : 'var(--border)',
                background: sound === s.value ? 'var(--brand-l)' : 'var(--surface)',
                color: sound === s.value ? 'var(--brand)' : 'var(--text3)' }}>
              {s.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>🔇 Audio ambiance available in upcoming update</p>
      </div>

      {/* Tips */}
      <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, var(--brand-l), var(--surface))', border: '1px solid var(--border)', borderRadius: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 6 }}>💡 Pomodoro Technique Tips</p>
        <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Commit fully to one task during each Pomodoro — no multitasking</li>
          <li>After every 4 Pomodoros, take a 15–30 minute long break</li>
          <li>If interrupted, restart the timer — don't count partial sessions</li>
          <li>Track distractions on paper to process them later</li>
        </ul>
      </div>
      </>
    }
    />
  );
}

import React, { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Priority = 'High' | 'Medium' | 'Low';
type Difficulty = 'Hard' | 'Medium' | 'Easy';

interface Subject {
  id: string;
  name: string;
  examDate: string;
  priority: Priority;
  difficulty: Difficulty;
}

interface SubjectResult {
  id: string;
  name: string;
  examDate: string;
  daysLeft: number;
  weight: number;
  hoursPerWeek: number;
  hoursPerDay: number;
  totalHours: number;
  urgencyColor: string;
  urgencyLabel: string;
}

// ─── Weight table ─────────────────────────────────────────────────────────────
const WEIGHT_TABLE: Record<Priority, Record<Difficulty, number>> = {
  High:   { Hard: 9, Medium: 6, Easy: 4 },
  Medium: { Hard: 6, Medium: 4, Easy: 3 },
  Low:    { Hard: 3, Medium: 2, Easy: 1 },
};

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FULL: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];
const DIFFICULTIES: Difficulty[] = ['Hard', 'Medium', 'Easy'];

const PRIORITY_COLOR: Record<Priority, string> = {
  High: '#dc2626', Medium: '#d97706', Low: '#2563eb',
};
const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Hard: '#7c3aed', Medium: '#0891b2', Easy: '#15803d',
};

function urgency(daysLeft: number): { color: string; label: string } {
  if (daysLeft <= 0)  return { color: '#6b7280', label: 'Passed' };
  if (daysLeft <= 7)  return { color: '#dc2626', label: '🔴 Urgent' };
  if (daysLeft <= 14) return { color: '#d97706', label: '🟡 Soon' };
  return { color: '#15803d', label: '🟢 On Track' };
}

function daysUntil(dateStr: string): number {
  if (!dateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(dateStr);
  exam.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((exam.getTime() - today.getTime()) / 86400000));
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Default today + 30 days ──────────────────────────────────────────────────
function defaultExamDate(offsetDays = 30) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// ─── ICS / iCalendar export (Browser Blob API) ──────────────────────────────
function generateICS(subjects: Subject[], results: SubjectResult[], studyDays: string[], hoursPerDay: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const toICSDate = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalculatorsPoint//Study Schedule Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const DAY_TO_NUM: Record<string, number> = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  results.forEach(r => {
    // Add exam day reminder event
    if (r.examDate) {
      const examDay = new Date(r.examDate);
      const dtstart = toICSDate(examDay) + 'Z';
      lines.push(
        'BEGIN:VEVENT',
        `UID:exam-${r.id}@calculatorspoint.com`,
        `DTSTART;VALUE=DATE:${r.examDate.replace(/-/g,'').slice(0,8)}`,
        `DTEND;VALUE=DATE:${r.examDate.replace(/-/g,'').slice(0,8)}`,
        `SUMMARY:📝 EXAM: ${r.name}`,
        `DESCRIPTION:Exam Day for ${r.name}. Allocated ${r.totalHours.toFixed(0)} study hours. Good luck!`,
        'BEGIN:VALARM',
        'TRIGGER:-PT24H',
        'ACTION:DISPLAY',
        `DESCRIPTION:Exam tomorrow: ${r.name}`,
        'END:VALARM',
        'END:VEVENT'
      );
    }

    // Add weekly study block events for each study day (next 4 weeks)
    const hpd = r.hoursPerDay;
    if (hpd <= 0) return;
    for (let week = 0; week < 4; week++) {
      studyDays.forEach(day => {
        const targetDow = DAY_TO_NUM[day] ?? 1;
        const date = new Date(today);
        const dayDiff = (targetDow - today.getDay() + 7) % 7 + week * 7;
        date.setDate(today.getDate() + dayDiff);
        if (r.examDate && date >= new Date(r.examDate)) return;
        const startHour = 9;
        date.setHours(startHour, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setMinutes(Math.round(hpd * 60));
        lines.push(
          'BEGIN:VEVENT',
          `UID:study-${r.id}-wk${week}-${day}@calculatorspoint.com`,
          `DTSTART:${toICSDate(date)}`,
          `DTEND:${toICSDate(endDate)}`,
          `SUMMARY:📚 Study: ${r.name} (${hpd.toFixed(1)}h)`,
          `DESCRIPTION:Study session for ${r.name}. Priority × Difficulty weight: ${r.weight}. Days until exam: ${r.daysLeft}.`,
          'END:VEVENT'
        );
      });
    }
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

// ─── Component ────────────────────────────────────────────────────────────────
export function StudySchedulePlanner() {
  const [hoursPerDay, setHoursPerDay] = useState('6');
  const [studyDays, setStudyDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: uid(), name: 'Mathematics', examDate: defaultExamDate(10), priority: 'High', difficulty: 'Hard' },
    { id: uid(), name: 'Physics', examDate: defaultExamDate(18), priority: 'Medium', difficulty: 'Hard' },
    { id: uid(), name: 'English', examDate: defaultExamDate(25), priority: 'Low', difficulty: 'Easy' },
  ]);
  const [results, setResults] = useState<SubjectResult[]>([]);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [copied, setCopied] = useState(false);

  // ─── Calculation ────────────────────────────────────────────────────────────
  const calc = useCallback(() => {
    const hpd = Math.max(1, Math.min(12, parseFloat(hoursPerDay) || 6));
    const studyDaysCount = studyDays.length || 1;
    const wkHours = hpd * studyDaysCount;
    setWeeklyHours(wkHours);

    // Only include subjects with a valid future exam date
    const valid = subjects.filter(s => s.name.trim() && s.examDate);

    // Compute weights
    const totalWeight = valid.reduce((sum, s) => sum + WEIGHT_TABLE[s.priority][s.difficulty], 0);
    if (totalWeight === 0) { setResults([]); return; }

    const res: SubjectResult[] = valid.map(s => {
      const days = daysUntil(s.examDate);
      const weight = WEIGHT_TABLE[s.priority][s.difficulty];
      const weeksUntilExam = Math.max(days / 7, 0);
      const hpw = (weight / totalWeight) * wkHours;
      const hpd2 = studyDaysCount > 0 ? hpw / studyDaysCount : 0;
      const totalH = hpw * weeksUntilExam;
      const { color, label } = urgency(days);
      return {
        id: s.id,
        name: s.name.trim() || 'Untitled',
        examDate: s.examDate,
        daysLeft: days,
        weight,
        hoursPerWeek: hpw,
        hoursPerDay: hpd2,
        totalHours: totalH,
        urgencyColor: color,
        urgencyLabel: label,
      };
    });

    // Sort by days left ascending (most urgent first)
    res.sort((a, b) => a.daysLeft - b.daysLeft);
    setResults(res);
  }, [hoursPerDay, studyDays, subjects]);

  useEffect(() => { calc(); }, [calc]);

  // ─── Subject CRUD ───────────────────────────────────────────────────────────
  const addSubject = () => {
    setSubjects(prev => [...prev, {
      id: uid(), name: '', examDate: defaultExamDate(30), priority: 'Medium', difficulty: 'Medium',
    }]);
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const toggleDay = (day: string) => {
    setStudyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // ─── Copy schedule ──────────────────────────────────────────────────────────
  const copySchedule = () => {
    if (results.length === 0) return;
    const lines: string[] = [
      '📅 STUDY SCHEDULE PLAN',
      `Study Days: ${studyDays.map(d => DAY_FULL[d]).join(', ')}`,
      `Hours/Day Available: ${hoursPerDay}h  |  Weekly Hours: ${weeklyHours.toFixed(1)}h`,
      '',
      '─── PER-SUBJECT ALLOCATION ───',
      `${'Subject'.padEnd(20)} ${'Exam Date'.padEnd(12)} ${'Days Left'.padEnd(10)} ${'Hrs/Day'.padEnd(9)} ${'Total Hrs'.padEnd(10)} Urgency`,
      '─'.repeat(78),
    ];
    results.forEach(r => {
      lines.push(
        `${r.name.padEnd(20)} ${r.examDate.padEnd(12)} ${String(r.daysLeft).padEnd(10)} ${r.hoursPerDay.toFixed(1).padEnd(9)} ${r.totalHours.toFixed(1).padEnd(10)} ${r.urgencyLabel}`
      );
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ─── Export .ics ────────────────────────────────────────────────────────────
  const exportICS = () => {
    if (results.length === 0) return;
    const icsContent = generateICS(subjects, results, studyDays, parseFloat(hoursPerDay) || 6);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-schedule.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── Style shortcuts ────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    padding: '10px 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)',
    borderRadius: 10, fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%', fontWeight: 700,
  };
  const label11: React.CSSProperties = {
    fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase',
  };
  const card: React.CSSProperties = {
    padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
  };
  const sectionHdr: React.CSSProperties = {
    fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6,
  };

  const totalDailyUsed = results.reduce((s, r) => s + r.hoursPerDay, 0);
  const hpdNum = parseFloat(hoursPerDay) || 6;
  const overload = totalDailyUsed > hpdNum + 0.05;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Row 1: hours/day + study days ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>

        {/* Hours per day */}
        <div style={card}>
          <label style={label11}>Available Hours / Day</label>
          <input
            type="number" style={inp} value={hoursPerDay}
            onChange={e => setHoursPerDay(e.target.value)}
            min={1} max={12} step={0.5}
          />
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>
            1 – 12 hours
          </div>
        </div>

        {/* Study days checkboxes */}
        <div style={card}>
          <p style={sectionHdr}>Study Days per Week</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DAYS_OF_WEEK.map(day => {
              const active = studyDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    padding: '7px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                    cursor: 'pointer', border: `1.5px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
                    background: active ? 'var(--brand)' : 'transparent',
                    color: active ? '#fff' : 'var(--text3)', transition: 'all .15s',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>
            {studyDays.length} day{studyDays.length !== 1 ? 's' : ''} / week
            &nbsp;·&nbsp; <strong style={{ color: 'var(--brand)' }}>{weeklyHours.toFixed(1)}h</strong> total weekly hours
          </div>
        </div>
      </div>

      {/* ── Subjects list ── */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ ...sectionHdr, marginBottom: 0 }}>Subjects / Exams</p>
          <button
            onClick={addSubject}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
              cursor: 'pointer', background: 'var(--brand)', color: '#fff', border: 'none',
            }}
          >
            ➕ Add Subject
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {subjects.map((s, idx) => (
            <div
              key={s.id}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr 1fr auto',
                gap: 8, alignItems: 'end',
                padding: '12px', background: 'var(--surface2)',
                border: '1px solid var(--border)', borderRadius: 10,
              }}
            >
              {/* Name */}
              <div>
                <label style={label11}>Subject {idx + 1}</label>
                <input
                  type="text" style={inp} value={s.name} placeholder="e.g. Mathematics"
                  onChange={e => updateSubject(s.id, 'name', e.target.value)}
                />
              </div>

              {/* Exam date */}
              <div>
                <label style={label11}>Exam Date</label>
                <input
                  type="date" style={inp} value={s.examDate}
                  onChange={e => updateSubject(s.id, 'examDate', e.target.value)}
                />
              </div>

              {/* Priority */}
              <div>
                <label style={label11}>Priority</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      onClick={() => updateSubject(s.id, 'priority', p)}
                      style={{
                        padding: '5px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                        cursor: 'pointer', border: `1.5px solid ${s.priority === p ? PRIORITY_COLOR[p] : 'var(--border)'}`,
                        background: s.priority === p ? `${PRIORITY_COLOR[p]}22` : 'transparent',
                        color: s.priority === p ? PRIORITY_COLOR[p] : 'var(--text3)',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label style={label11}>Difficulty</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      onClick={() => updateSubject(s.id, 'difficulty', d)}
                      style={{
                        padding: '5px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                        cursor: 'pointer', border: `1.5px solid ${s.difficulty === d ? DIFFICULTY_COLOR[d] : 'var(--border)'}`,
                        background: s.difficulty === d ? `${DIFFICULTY_COLOR[d]}22` : 'transparent',
                        color: s.difficulty === d ? DIFFICULTY_COLOR[d] : 'var(--text3)',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remove */}
              <div style={{ paddingBottom: 2 }}>
                <button
                  onClick={() => removeSubject(s.id)}
                  title="Remove subject"
                  style={{
                    width: 32, height: 32, borderRadius: 8, fontSize: 14,
                    cursor: 'pointer', background: '#fee2e2', color: '#dc2626',
                    border: '1px solid #fca5a5', fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {subjects.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: '20px 0' }}>
              No subjects added yet. Click ➕ Add Subject to begin.
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {results.length > 0 && (
        <>
          {/* Overload warning */}
          {overload && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: '#fef2f222', border: '1.5px solid #f9731655',
              color: '#ea580c', fontSize: 12, fontWeight: 700,
            }}>
              ⚠️ Total allocated hours/day ({totalDailyUsed.toFixed(1)}h) may exceed your available
              {' '}{hpdNum}h/day — consider adjusting priorities or adding more study days.
            </div>
          )}

          {/* Per-subject allocation table */}
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ ...sectionHdr, marginBottom: 0 }}>Per-Subject Allocation</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={exportICS}
                  title="Export to Google Calendar / Apple Calendar / Outlook"
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                    cursor: 'pointer', background: '#eff6ff', color: '#2563eb',
                    border: '1.5px solid #bfdbfe', transition: 'all .2s',
                  }}
                >
                  📅 Export .ics
                </button>
                <button
                  onClick={copySchedule}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                    cursor: 'pointer',
                    background: copied ? '#dcfce7' : 'var(--surface2)',
                    color: copied ? '#15803d' : 'var(--text)',
                    border: `1.5px solid ${copied ? '#86efac' : 'var(--border)'}`,
                    transition: 'all .2s',
                  }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Schedule'}
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)' }}>
                    {['Subject', 'Priority × Difficulty', 'Exam Date', 'Days Left', 'Hrs/Week', 'Hrs/Day', 'Total Hours', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '9px 12px', textAlign: 'left', fontSize: 10,
                        fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase',
                        borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr
                      key={r.id}
                      style={{ background: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}
                    >
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text)' }}>
                        {r.name}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                          background: `${r.urgencyColor}18`, color: r.urgencyColor,
                        }}>
                          ×{r.weight}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                        {r.examDate}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontWeight: 900, fontSize: 15, color: r.urgencyColor,
                        }}>
                          {r.daysLeft}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 3 }}>days</span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text)' }}>
                        {r.hoursPerWeek.toFixed(1)}h
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontWeight: 900, fontSize: 16, color: 'var(--brand)',
                          fontFamily: 'var(--font-display)',
                        }}>
                          {r.hoursPerDay.toFixed(1)}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 3 }}>h</span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text2)' }}>
                        {r.totalHours.toFixed(0)}h
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 99,
                          background: `${r.urgencyColor}18`, color: r.urgencyColor,
                          whiteSpace: 'nowrap',
                        }}>
                          {r.urgencyLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--surface)' }}>
                    <td colSpan={5} style={{ padding: '10px 12px', fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>
                      Daily Total
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontWeight: 900, fontSize: 16,
                        color: overload ? '#dc2626' : '#15803d',
                        fontFamily: 'var(--font-display)',
                      }}>
                        {totalDailyUsed.toFixed(1)}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 3 }}>
                        h / {hpdNum}h available {overload ? '⚠️' : '✓'}
                      </span>
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Weekly schedule grid */}
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ ...sectionHdr, marginBottom: 0 }}>Weekly Schedule Grid</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)' }}>
                    <th style={{
                      padding: '9px 14px', textAlign: 'left', fontSize: 10,
                      fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase',
                      borderBottom: '1px solid var(--border)', width: 90,
                    }}>Day</th>
                    {results.map(r => (
                      <th key={r.id} style={{
                        padding: '9px 12px', textAlign: 'center', fontSize: 10,
                        fontWeight: 800, color: r.urgencyColor, textTransform: 'uppercase',
                        borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                      }}>
                        {r.name}
                      </th>
                    ))}
                    <th style={{
                      padding: '9px 12px', textAlign: 'center', fontSize: 10,
                      fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase',
                      borderBottom: '1px solid var(--border)',
                    }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS_OF_WEEK.map((day, idx) => {
                    const isStudyDay = studyDays.includes(day);
                    const rowTotal = isStudyDay ? results.reduce((s, r) => s + r.hoursPerDay, 0) : 0;
                    return (
                      <tr
                        key={day}
                        style={{
                          background: !isStudyDay
                            ? 'var(--surface2)'
                            : idx % 2 === 0 ? 'var(--surface)' : 'var(--surface2)',
                          opacity: isStudyDay ? 1 : 0.45,
                        }}
                      >
                        <td style={{ padding: '10px 14px', fontWeight: 800, color: isStudyDay ? 'var(--text)' : 'var(--text3)', fontSize: 12 }}>
                          {DAY_FULL[day]}
                          {!isStudyDay && <span style={{ fontSize: 9, marginLeft: 5, color: 'var(--text3)' }}>OFF</span>}
                        </td>
                        {results.map(r => (
                          <td key={r.id} style={{ padding: '10px 12px', textAlign: 'center' }}>
                            {isStudyDay ? (
                              <div style={{
                                display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                                gap: 3, minWidth: 54,
                              }}>
                                <div style={{
                                  padding: '4px 10px', borderRadius: 8,
                                  background: `${r.urgencyColor}18`,
                                  border: `1px solid ${r.urgencyColor}44`,
                                  color: r.urgencyColor, fontWeight: 900, fontSize: 13,
                                }}>
                                  {r.hoursPerDay.toFixed(1)}h
                                </div>
                                <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 99 }}>
                                  <div style={{
                                    width: `${Math.min(100, (r.hoursPerDay / hpdNum) * 100)}%`,
                                    height: '100%', background: r.urgencyColor, borderRadius: 99,
                                  }} />
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text3)', fontSize: 11 }}>—</span>
                            )}
                          </td>
                        ))}
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          {isStudyDay ? (
                            <span style={{
                              fontWeight: 900, fontSize: 13,
                              color: rowTotal > hpdNum ? '#dc2626' : 'var(--text)',
                            }}>
                              {rowTotal.toFixed(1)}h
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text3)', fontSize: 11 }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #2563eb22, #2563eb0a)', border: '2px solid #2563eb44', borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: 6 }}>Weekly Study</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#2563eb', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {weeklyHours.toFixed(0)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>hours / week</div>
            </div>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #7c3aed22, #7c3aed0a)', border: '2px solid #7c3aed44', borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 6 }}>Subjects</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#7c3aed', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {results.length}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>tracked</div>
            </div>
            <div style={{
              padding: '16px',
              background: `linear-gradient(135deg, ${overload ? '#dc262622' : '#15803d22'}, ${overload ? '#dc26260a' : '#15803d0a'})`,
              border: `2px solid ${overload ? '#dc262644' : '#15803d44'}`,
              borderRadius: 14, textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: overload ? '#dc2626' : '#15803d', textTransform: 'uppercase', marginBottom: 6 }}>Daily Load</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: overload ? '#dc2626' : '#15803d', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {totalDailyUsed.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                h/day {overload ? '⚠️ over limit' : '✓ within limit'}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ ...card, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <p style={{ ...sectionHdr, marginBottom: 0, marginRight: 4 }}>Urgency:</p>
            {[
              { color: '#dc2626', label: '🔴 Urgent (≤7 days)' },
              { color: '#d97706', label: '🟡 Soon (≤14 days)' },
              { color: '#15803d', label: '🟢 On Track (>14 days)' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>
              Weight formula: Priority × Difficulty
            </div>
          </div>
        </>
      )}
    </div>
  );
}

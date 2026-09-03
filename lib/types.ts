export type SetEntry = {
  weight: number; // kg
  reps: number;
};

export type ExerciseEntry = {
  id: string;
  name: string;
  part: string; // 身体部位
  sets: SetEntry[];
};

export type Workout = {
  id: string;
  date: string; // YYYY-MM-DD
  note: string;
  exercises: ExerciseEntry[];
};

export function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** 本地日期 → YYYY-MM-DD（避免 toISOString 的时区偏移） */
export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayStr(): string {
  return toDateStr(new Date());
}

/** N 天前的日期字符串 */
export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateStr(d);
}

/** YYYY-MM-DD → "9月3日 周三" */
export function formatDateCn(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${m}月${d}日 ${week[date.getDay()]}`;
}

export function formatDateFull(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

/** 本周（周一起）与本月有训练的天数 */
export function computeStats(dates: string[]): { week: number; month: number } {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 周一=0
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let week = 0;
  let month = 0;
  for (const ds of dates) {
    const [y, m, d] = ds.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (date >= monday) week++;
    if (date >= monthStart) month++;
  }
  return { week, month };
}

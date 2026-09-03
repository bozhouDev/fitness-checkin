"use client";

import { useState } from "react";

type Props = {
  /** YYYY-MM-DD 的集合，有训练的日期会被标记 */
  checkedDates: Set<string>;
};

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

export default function MonthCalendar({ checkedDates }: Props) {
  const today = new Date();
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const first = new Date(view.year, view.month, 1);
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  // 周一开头
  const leading = (first.getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(leading).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const shift = (delta: number) => {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div>
      <div className="cal-header">
        <button className="cal-nav" onClick={() => shift(-1)} aria-label="上个月">
          ‹
        </button>
        <span className="cal-month">
          {view.year} 年 {view.month + 1} 月
        </span>
        <button className="cal-nav" onClick={() => shift(1)} aria-label="下个月">
          ›
        </button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="cal-weekday">
            {w}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />;
          const ds = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const checked = checkedDates.has(ds);
          const isToday = ds === todayStr;
          return (
            <span
              key={ds}
              className={`cal-day ${checked ? "checked" : ""} ${isToday && !checked ? "today" : ""}`}
            >
              {day}
            </span>
          );
        })}
      </div>

      <div className="cal-legend">
        <span className="cal-dot" />
        有训练记录的日期
      </div>
    </div>
  );
}

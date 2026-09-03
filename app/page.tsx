"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { computeStats, formatDateCn } from "@/lib/types";
import MonthCalendar from "@/components/MonthCalendar";
import type { Workout } from "@/lib/types";

export default function HomePage() {
  const { workouts } = useStore();

  const sorted = [...workouts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const checkedDates = new Set(sorted.map((w) => w.date));
  const stats = computeStats(sorted.map((w) => w.date));
  const recent: Workout[] = sorted.slice(0, 3);

  return (
    <main className="page">
      <header className="hero-greeting">
        <span className="hero-mark">💪</span>
        <div>
          <div className="hero-title">今天的训练</div>
          <div style={{ fontSize: 14, color: "var(--color-stone)" }}>
            记录下来，别偷懒
          </div>
        </div>
      </header>

      {/* 统计 */}
      <section className="stats-grid">
        <div className="stat-card accent-card sky">
          <div className="stat-num">{stats.week}</div>
          <div className="stat-label">本周训练（次）</div>
        </div>
        <div className="stat-card accent-card peach">
          <div className="stat-num">{stats.month}</div>
          <div className="stat-label">本月训练（次）</div>
        </div>
      </section>

      {/* 打卡日历 */}
      <section className="section">
        <div className="card">
          <MonthCalendar checkedDates={checkedDates} />
        </div>
      </section>

      {/* 最近的训练 */}
      <section className="section">
        <div className="section-label">最近的训练</div>
        {recent.length === 0 ? (
          <div className="card empty-state">
            <span className="empty-emoji">🏋️</span>
            还没有训练记录，点击下方 + 记一笔
          </div>
        ) : (
          recent.map((w) => (
            <div key={w.id} className="card">
              <div className="workout-head">
                <span className="workout-date">{formatDateCn(w.date)}</span>
                <span className="pill pill-blue">
                  {w.exercises.length} 个动作
                </span>
              </div>
              {w.exercises.map((e) => (
                <div key={e.id} className="workout-ex-line">
                  <span className="workout-ex-name">{e.name}</span>
                  <span className="workout-ex-sets">
                    {e.sets
                      .map((s) =>
                        s.weight > 0
                          ? `${s.weight}kg×${s.reps}`
                          : `自重×${s.reps}`
                      )
                      .join("，")}
                  </span>
                </div>
              ))}
              {w.note && <p className="workout-note">“{w.note}”</p>}
            </div>
          ))
        )}
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Link href="/history" className="btn btn-outline">
            查看全部历史
          </Link>
        </div>
      </section>
    </main>
  );
}

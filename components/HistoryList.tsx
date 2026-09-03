"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteWorkoutById } from "@/lib/actions";
import { formatDateCn } from "@/lib/types";
import type { Workout } from "@/lib/types";

export default function HistoryList({ workouts }: { workouts: Workout[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (w: Workout) => {
    if (!window.confirm(`确定删除 ${formatDateCn(w.date)} 的这次训练吗？`))
      return;
    setDeletingId(w.id);
    startTransition(async () => {
      await deleteWorkoutById(w.id);
      setDeletingId(null);
      router.refresh();
    });
  };

  if (workouts.length === 0) {
    return (
      <div className="card empty-state">
        <span className="empty-emoji">🏋️</span>
        还没有训练记录
        <div style={{ marginTop: 12 }}>
          <Link href="/new" className="btn btn-primary">
            记一笔
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section">
      {workouts.map((w) => {
        const totalSets = w.exercises.reduce((n, e) => n + e.sets.length, 0);
        const deleting = deletingId === w.id && isPending;
        return (
          <div
            key={w.id}
            className="card"
            style={deleting ? { opacity: 0.5 } : undefined}
          >
            <div className="workout-head">
              <span className="workout-date">{formatDateCn(w.date)}</span>
              <span style={{ display: "flex", gap: 8 }}>
                <span className="pill pill-blue">
                  {w.exercises.length} 个动作
                </span>
                <span className="pill pill-peach">{totalSets} 组</span>
              </span>
            </div>

            {w.exercises.map((e) => (
              <div key={e.id} className="workout-ex-line">
                <span className="workout-ex-name">{e.name}</span>
                <span className="workout-ex-sets">
                  {e.sets
                    .map((s) =>
                      s.weight > 0 ? `${s.weight}kg×${s.reps}` : `自重×${s.reps}`
                    )
                    .join("，")}
                </span>
              </div>
            ))}

            {w.note && <p className="workout-note">“{w.note}”</p>}

            <div className="workout-actions">
              <button
                className="btn btn-danger-text"
                disabled={isPending}
                onClick={() => handleDelete(w)}
              >
                {deleting ? "删除中…" : "删除"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => router.push(`/new?id=${w.id}`)}
              >
                编辑
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}

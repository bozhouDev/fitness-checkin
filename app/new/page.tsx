"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { genId, todayStr } from "@/lib/types";
import type { ExerciseEntry, SetEntry } from "@/lib/types";
import ExercisePicker from "@/components/ExercisePicker";

function NewWorkoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");
  const { addWorkout, updateWorkout, getWorkout } = useStore();

  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState("");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  // 编辑模式：载入已有训练
  useEffect(() => {
    if (editId) {
      const w = getWorkout(editId);
      if (w) {
        setDate(w.date);
        setNote(w.note);
        setExercises(
          w.exercises.map((e) => ({
            ...e,
            sets: e.sets.map((s) => ({ ...s })),
          }))
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const isValid = useMemo(() => {
    return (
      !!date &&
      exercises.length > 0 &&
      exercises.every((e) => e.sets.some((s) => s.reps > 0))
    );
  }, [date, exercises]);

  const addExercise = (name: string, part: string) => {
    setExercises((prev) => [
      ...prev,
      { id: genId(), name, part, sets: [{ weight: 0, reps: 0 }] },
    ]);
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const updateSet = (exId: string, idx: number, patch: Partial<SetEntry>) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id !== exId
          ? e
          : {
              ...e,
              sets: e.sets.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
            }
      )
    );
  };

  const addSet = (exId: string) => {
    setExercises((prev) =>
      prev.map((e) => {
        if (e.id !== exId) return e;
        const last = e.sets[e.sets.length - 1];
        const template = last ? { ...last } : { weight: 0, reps: 0 };
        return { ...e, sets: [...e.sets, template] };
      })
    );
  };

  const removeSet = (exId: string, idx: number) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id !== exId ? e : { ...e, sets: e.sets.filter((_, i) => i !== idx) }
      )
    );
  };

  const handleSave = () => {
    if (!isValid) {
      setShowError(true);
      return;
    }
    const cleaned = exercises.map((e) => ({
      ...e,
      // 只保留有效的组（次数大于 0）
      sets: e.sets.filter((s) => s.reps > 0),
    }));
    if (editId) {
      updateWorkout({ id: editId, date, note, exercises: cleaned });
    } else {
      addWorkout({ id: genId(), date, note, exercises: cleaned });
    }
    router.push(editId ? "/history" : "/");
  };

  return (
    <main className="page" style={{ paddingBottom: 140 }}>
      <header className="page-header">
        <div>
          <h1 className="page-title">{editId ? "编辑训练" : "记一笔"}</h1>
          <p className="page-subtitle">
            {editId ? "改完记得保存" : "今天练了什么？"}
          </p>
        </div>
        <button className="btn btn-text" onClick={() => router.back()}>
          取消
        </button>
      </header>

      <section className="card">
        <div className="field">
          <label className="field-label" htmlFor="date">
            日期
          </label>
          <input
            id="date"
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="field-label" htmlFor="note">
            备注（可选）
          </label>
          <textarea
            id="note"
            className="textarea"
            placeholder="今天状态怎么样？"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </section>

      <section className="section">
        <div className="section-label">动作（{exercises.length}）</div>
        {exercises.map((e) => (
          <div key={e.id} className="exercise-card">
            <div className="exercise-head">
              <span className="exercise-name">{e.name}</span>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="pill pill-gray">{e.part}</span>
                <button
                  className="btn btn-danger-text"
                  style={{ padding: "4px 8px" }}
                  onClick={() => removeExercise(e.id)}
                >
                  删除
                </button>
              </span>
            </div>

            {e.sets.map((s, i) => (
              <div key={i} className="set-row">
                <span className="set-index">{i + 1}</span>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.5}
                  placeholder="重量kg"
                  value={s.weight || ""}
                  onChange={(ev) =>
                    updateSet(e.id, i, {
                      weight: ev.target.value === "" ? 0 : Number(ev.target.value),
                    })
                  }
                />
                <span className="set-x">×</span>
                <input
                  className="input"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="次数"
                  value={s.reps || ""}
                  onChange={(ev) =>
                    updateSet(e.id, i, {
                      reps: ev.target.value === "" ? 0 : Number(ev.target.value),
                    })
                  }
                />
                <button
                  className="set-del"
                  aria-label="删除这一组"
                  onClick={() => removeSet(e.id, i)}
                >
                  ✕
                </button>
              </div>
            ))}

            <button className="add-set-btn" onClick={() => addSet(e.id)}>
              + 添加一组
            </button>
          </div>
        ))}

        {showError && !isValid && (
          <p
            style={{
              color: "var(--color-vermillion)",
              fontSize: 14,
              marginTop: 8,
            }}
          >
            至少添加一个动作，且每组要填次数
          </p>
        )}

        <button
          className="btn btn-ghost btn-lg"
          style={{ marginTop: 12 }}
          onClick={() => setPickerOpen(true)}
        >
          + 添加动作
        </button>
      </section>

      {/* 底部保存条 */}
      <div className="form-footer">
        <div className="form-footer-inner">
          <button className="btn btn-primary btn-lg" onClick={handleSave}>
            {editId ? "保存修改" : "完成打卡 ✓"}
          </button>
        </div>
      </div>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={addExercise}
        existingNames={exercises.map((e) => e.name)}
      />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <NewWorkoutPage />
    </Suspense>
  );
}

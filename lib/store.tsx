"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Workout } from "./types";
import { MOCK_WORKOUTS } from "./data";

type Store = {
  workouts: Workout[];
  addWorkout: (w: Workout) => void;
  updateWorkout: (w: Workout) => void;
  deleteWorkout: (id: string) => void;
  getWorkout: (id: string) => Workout | undefined;
};

const StoreContext = createContext<Store | null>(null);

/** 第一版：数据只存在内存里（Context），刷新后恢复为临时数据 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>(MOCK_WORKOUTS);

  const store = useMemo<Store>(
    () => ({
      workouts,
      addWorkout: (w) => setWorkouts((prev) => [w, ...prev]),
      updateWorkout: (w) =>
        setWorkouts((prev) => prev.map((it) => (it.id === w.id ? w : it))),
      deleteWorkout: (id) =>
        setWorkouts((prev) => prev.filter((it) => it.id !== id)),
      getWorkout: (id) => workouts.find((it) => it.id === id),
    }),
    [workouts]
  );

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

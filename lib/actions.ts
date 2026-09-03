"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { ExerciseEntry, Workout } from "@/lib/types";

/** 数据库行 → 页面使用的格式（日期转为 YYYY-MM-DD 字符串） */
type WorkoutRow = {
  id: string;
  date: Date;
  note: string;
  exercises: {
    id: string;
    name: string;
    part: string;
    order: number;
    sets: { id: string; weight: number; reps: number; order: number }[];
  }[];
};

function toWorkout(row: WorkoutRow): Workout {
  return {
    id: row.id,
    // @db.Date 返回 UTC 午夜的 Date，直接取日期部分即可还原
    date: row.date.toISOString().slice(0, 10),
    note: row.note,
    exercises: row.exercises
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((e) => ({
        id: e.id,
        name: e.name,
        part: e.part,
        sets: e.sets
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((s) => ({ weight: s.weight, reps: s.reps })),
      })),
  };
}

function dateInputToDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

export async function getWorkouts(): Promise<Workout[]> {
  const rows = await prisma.workout.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    include: { exercises: { include: { sets: true } } },
  });
  return rows.map(toWorkout);
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  const row = await prisma.workout.findUnique({
    where: { id },
    include: { exercises: { include: { sets: true } } },
  });
  return row ? toWorkout(row) : null;
}

export type WorkoutInput = {
  date: string;
  note: string;
  exercises: ExerciseEntry[];
};

export async function createWorkout(input: WorkoutInput): Promise<void> {
  await prisma.workout.create({
    data: {
      date: dateInputToDate(input.date),
      note: input.note,
      exercises: {
        create: input.exercises.map((e, i) => ({
          name: e.name,
          part: e.part,
          order: i,
          sets: {
            create: e.sets.map((s, j) => ({
              weight: s.weight,
              reps: s.reps,
              order: j,
            })),
          },
        })),
      },
    },
  });
  revalidatePath("/");
  revalidatePath("/history");
}

export async function updateWorkoutById(
  id: string,
  input: WorkoutInput
): Promise<void> {
  await prisma.$transaction([
    prisma.workout.update({
      where: { id },
      data: {
        date: dateInputToDate(input.date),
        note: input.note,
      },
    }),
    // 简单可靠的做法：旧动作（连同各组）级联删掉，再按当前内容重建
    prisma.workoutExercise.deleteMany({ where: { workoutId: id } }),
    prisma.workout.update({
      where: { id },
      data: {
        exercises: {
          create: input.exercises.map((e, i) => ({
            name: e.name,
            part: e.part,
            order: i,
            sets: {
              create: e.sets.map((s, j) => ({
                weight: s.weight,
                reps: s.reps,
                order: j,
              })),
            },
          })),
        },
      },
    }),
  ]);
  revalidatePath("/");
  revalidatePath("/history");
}

export async function deleteWorkoutById(id: string): Promise<void> {
  await prisma.workout.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/history");
}

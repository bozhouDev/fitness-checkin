// 把 8 条示例训练写入数据库（与第一版的临时数据相同，日期相对运行当天生成）
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});

function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return new Date(`${toDateStr(d)}T00:00:00.000Z`);
}

const MOCK_WORKOUTS = [
  {
    date: daysAgo(0),
    note: "状态不错，重量加了 2.5kg",
    exercises: [
      {
        name: "卧推",
        part: "胸",
        sets: [
          { weight: 60, reps: 8 },
          { weight: 65, reps: 6 },
          { weight: 65, reps: 5 },
        ],
      },
      {
        name: "哑铃飞鸟",
        part: "胸",
        sets: [
          { weight: 10, reps: 12 },
          { weight: 10, reps: 12 },
        ],
      },
    ],
  },
  {
    date: daysAgo(2),
    note: "",
    exercises: [
      {
        name: "深蹲",
        part: "腿",
        sets: [
          { weight: 80, reps: 8 },
          { weight: 85, reps: 6 },
          { weight: 85, reps: 6 },
          { weight: 90, reps: 4 },
        ],
      },
      {
        name: "腿举",
        part: "腿",
        sets: [
          { weight: 120, reps: 10 },
          { weight: 120, reps: 10 },
        ],
      },
    ],
  },
  {
    date: daysAgo(4),
    note: "引体向上进步了，能做 8 个了",
    exercises: [
      {
        name: "引体向上",
        part: "背",
        sets: [
          { weight: 0, reps: 8 },
          { weight: 0, reps: 7 },
          { weight: 0, reps: 6 },
        ],
      },
      {
        name: "杠铃划船",
        part: "背",
        sets: [
          { weight: 50, reps: 10 },
          { weight: 50, reps: 10 },
          { weight: 55, reps: 8 },
        ],
      },
    ],
  },
  {
    date: daysAgo(6),
    note: "",
    exercises: [
      {
        name: "推举",
        part: "肩",
        sets: [
          { weight: 35, reps: 8 },
          { weight: 40, reps: 6 },
        ],
      },
      {
        name: "侧平举",
        part: "肩",
        sets: [
          { weight: 8, reps: 15 },
          { weight: 8, reps: 15 },
          { weight: 8, reps: 12 },
        ],
      },
    ],
  },
  {
    date: daysAgo(9),
    note: "",
    exercises: [
      {
        name: "硬拉",
        part: "背",
        sets: [
          { weight: 100, reps: 5 },
          { weight: 110, reps: 3 },
          { weight: 110, reps: 3 },
        ],
      },
    ],
  },
  {
    date: daysAgo(12),
    note: "手臂日",
    exercises: [
      {
        name: "二头弯举",
        part: "手臂",
        sets: [
          { weight: 15, reps: 12 },
          { weight: 15, reps: 10 },
        ],
      },
      {
        name: "三头下压",
        part: "手臂",
        sets: [
          { weight: 25, reps: 12 },
          { weight: 25, reps: 12 },
          { weight: 30, reps: 8 },
        ],
      },
    ],
  },
  {
    date: daysAgo(16),
    note: "",
    exercises: [
      {
        name: "卧推",
        part: "胸",
        sets: [
          { weight: 57.5, reps: 8 },
          { weight: 62.5, reps: 6 },
        ],
      },
      {
        name: "上斜哑铃卧推",
        part: "胸",
        sets: [
          { weight: 20, reps: 10 },
          { weight: 20, reps: 8 },
        ],
      },
    ],
  },
  {
    date: daysAgo(21),
    note: "腿部日，练完走路都费劲",
    exercises: [
      {
        name: "深蹲",
        part: "腿",
        sets: [
          { weight: 75, reps: 8 },
          { weight: 80, reps: 8 },
          { weight: 85, reps: 5 },
        ],
      },
    ],
  },
];

async function main() {
  const count = await prisma.workout.count();
  if (count > 0) {
    console.log(`数据库已有 ${count} 条训练记录，跳过种子数据`);
    return;
  }
  for (const w of MOCK_WORKOUTS) {
    await prisma.workout.create({
      data: {
        date: w.date,
        note: w.note,
        exercises: {
          create: w.exercises.map((e, i) => ({
            name: e.name,
            part: e.part,
            order: i,
            sets: { create: e.sets },
          })),
        },
      },
    });
  }
  console.log(`已写入 ${MOCK_WORKOUTS.length} 条示例训练`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import type { Workout } from "./types";
import { daysAgo, todayStr } from "./types";

/** 动作库：按身体部位分类的常见动作 */
export const EXERCISE_LIBRARY: Record<string, string[]> = {
  胸: ["卧推", "上斜哑铃卧推", "哑铃飞鸟", "双杠臂屈伸", "俯卧撑"],
  背: ["引体向上", "杠铃划船", "高位下拉", "坐姿划船", "硬拉"],
  腿: ["深蹲", "腿举", "罗马尼亚硬拉", "腿弯举", "弓步蹲"],
  肩: ["推举", "侧平举", "面拉", "耸肩"],
  手臂: ["二头弯举", "锤式弯举", "三头下压", "仰卧臂屈伸"],
  核心: ["平板支撑", "卷腹", "悬垂举腿", "俄罗斯转体"],
};

export const BODY_PARTS = Object.keys(EXERCISE_LIBRARY);

/** 临时数据：相对今天生成，方便直接看到日历标记和统计 */
export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "mock-1",
    date: todayStr(),
    note: "状态不错，重量加了 2.5kg",
    exercises: [
      {
        id: "m1-e1",
        name: "卧推",
        part: "胸",
        sets: [
          { weight: 60, reps: 8 },
          { weight: 65, reps: 6 },
          { weight: 65, reps: 5 },
        ],
      },
      {
        id: "m1-e2",
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
    id: "mock-2",
    date: daysAgo(2),
    note: "",
    exercises: [
      {
        id: "m2-e1",
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
        id: "m2-e2",
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
    id: "mock-3",
    date: daysAgo(4),
    note: "引体向上进步了，能做 8 个了",
    exercises: [
      {
        id: "m3-e1",
        name: "引体向上",
        part: "背",
        sets: [
          { weight: 0, reps: 8 },
          { weight: 0, reps: 7 },
          { weight: 0, reps: 6 },
        ],
      },
      {
        id: "m3-e2",
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
    id: "mock-4",
    date: daysAgo(6),
    note: "",
    exercises: [
      {
        id: "m4-e1",
        name: "推举",
        part: "肩",
        sets: [
          { weight: 35, reps: 8 },
          { weight: 40, reps: 6 },
        ],
      },
      {
        id: "m4-e2",
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
    id: "mock-5",
    date: daysAgo(9),
    note: "",
    exercises: [
      {
        id: "m5-e1",
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
    id: "mock-6",
    date: daysAgo(12),
    note: "手臂日",
    exercises: [
      {
        id: "m6-e1",
        name: "二头弯举",
        part: "手臂",
        sets: [
          { weight: 15, reps: 12 },
          { weight: 15, reps: 10 },
        ],
      },
      {
        id: "m6-e2",
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
    id: "mock-7",
    date: daysAgo(16),
    note: "",
    exercises: [
      {
        id: "m7-e1",
        name: "卧推",
        part: "胸",
        sets: [
          { weight: 57.5, reps: 8 },
          { weight: 62.5, reps: 6 },
        ],
      },
      {
        id: "m7-e2",
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
    id: "mock-8",
    date: daysAgo(21),
    note: "腿部日，练完走路都费劲",
    exercises: [
      {
        id: "m8-e1",
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

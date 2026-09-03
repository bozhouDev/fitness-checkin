import { getWorkouts } from "@/lib/actions";
import HistoryList from "@/components/HistoryList";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const workouts = await getWorkouts();
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">历史记录</h1>
          <p className="page-subtitle">共 {workouts.length} 次训练</p>
        </div>
      </header>
      <HistoryList workouts={workouts} />
    </main>
  );
}

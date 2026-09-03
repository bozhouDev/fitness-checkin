import { getWorkouts } from "@/lib/actions";
import HomeView from "@/components/HomeView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const workouts = await getWorkouts();
  return <HomeView workouts={workouts} />;
}

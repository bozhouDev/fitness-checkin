import { getWorkoutById } from "@/lib/actions";
import NewWorkoutForm from "@/components/NewWorkoutForm";

export const dynamic = "force-dynamic";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const workout = id ? await getWorkoutById(id) : null;
  return <NewWorkoutForm workout={workout} />;
}

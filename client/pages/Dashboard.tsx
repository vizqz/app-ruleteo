import { useAppStore } from "@/store/appStore";
import CardTile from "@/components/dashboard/CardTile";
import UpcomingDates from "@/components/dashboard/UpcomingDates";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const {
    state: { cards },
  } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-heading text-2xl md:text-3xl">Bienvenido, Caleb</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {cards.map((c) => (
          <CardTile key={c.id} card={c} />
        ))}
      </div>
    </div>
  );
}

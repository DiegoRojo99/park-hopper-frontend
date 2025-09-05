import { LiveAttraction } from "../../types/db";
import AttractionCard from "./AttractionCard";

function sortByWaitTime(a: LiveAttraction, b: LiveAttraction) {
  const waitA = a.waitTime;
  const waitB = b.waitTime;
  if(!waitA) return 1; // Treat null as greater than any number
  if(!waitB) return -1; // Treat null as greater than any number
  return waitB - waitA;
}

function filterNonApplicableRide(attraction: LiveAttraction) {
  const status = attraction.status;
  return status && ["OPERATING", "DOWN", "CLOSED"].includes(status);
}

export default function AttractionGrid({ attractions }: { attractions: LiveAttraction[] }) {
  if (!attractions || attractions.length === 0) {
    return <div>No attractions available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {attractions.filter(filterNonApplicableRide).sort(sortByWaitTime).map((attraction) => (
        <AttractionCard key={attraction.id} attraction={attraction} />
      ))}
    </div>
  );
}
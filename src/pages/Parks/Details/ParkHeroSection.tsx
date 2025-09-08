import { LivePark } from "../../../types/Park";

export default function ParkHeroSection({ park }: { park: LivePark }) {
  return (
    <section
      className={`relative w-full text-center h-48 md:h-96 bg-light-secondary dark:bg-dark-secondary overflow-hidden`}
    >
      {/* Park main image */}
      {park.mainImage && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${park.mainImage.url})` }}
        />
      )}

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      
      {/* Park name and destination */}
      <div className="relative z-10 p-6 flex flex-col justify-center h-full">
        <h1 className="text-2xl sm:text-4xl font-bold text-white">
          {park.name}
        </h1>
        <p className="text-md sm:text-lg text-gray-200">
          {park.destination?.name || "No Destination"}
        </p>
      </div>
    </section>
  );
};
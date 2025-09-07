import { LiveRestaurant } from "../../types/db";

export default function RestaurantCard({ restaurant }: { restaurant: LiveRestaurant }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h3 className="text-md font-bold text-center mb-2 min-h-12 flex">
        <span className="my-auto text-center mx-auto">{restaurant.name}</span>
      </h3>
      <hr />
      {restaurant.cuisines?.length ? (
        <>
          <div className="mt-2 text-center flex flex-row flex-wrap justify-center w-full">
            {restaurant.cuisines?.map((cuisine, index) => (
              <span key={index} className="text-sm w-full text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-[4px] px-2 py-1 m-1">
                {cuisine}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          No cuisines available.
        </div>
      )}
    </div>
  );
}
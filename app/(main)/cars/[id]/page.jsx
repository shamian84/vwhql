import { getCarById } from "@/action/car-listing";
import { getUserTestDrives } from "@/action/test-drive";
import { CarDetails } from "./_components/cars-details";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "Car Not Found | Vehiql",
      description: "The requested car could not be found",
    };
  }

  const car = result.data;

  return {
    title: `${car.year} ${car.make} ${car.model} | Vehiql`,
    description: car.description.substring(0, 160),
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  };
}

export default async function CarDetailsPage({ params }) {
  // Fetch car details
  const { id } = await params;
  const result = await getCarById(id);

  // If car not found, show 404
  if (!result.success) {
    notFound();
  }

  // Fetch test drive info
  const testDriveResult = await getUserTestDrives();
  const userTestDrive = testDriveResult.success
    ? testDriveResult.data.find((booking) => booking.carId === id)
    : null;

  return (
    <div className="container mx-auto px-4 py-12 mt-20">
      <CarDetails car={result.data} testDriveInfo={{ userTestDrive }} />
    </div>
  );
}

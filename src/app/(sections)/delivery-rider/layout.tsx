import NavBar from "@/components/features/navbar/NavBar";
import GeoLocationUpdater from "@/components/GeoLocationUpdater";

export default function DeliveryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      {children}
      <GeoLocationUpdater />
    </>
  );
}

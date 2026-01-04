import GeoLocationUpdater from "@/components/GeoLocationUpdater";
import LayoutUI from "./_components/LayoutUI";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutUI>
      {children}
      <GeoLocationUpdater />
    </LayoutUI>
  );
}

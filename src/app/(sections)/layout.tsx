import AuthStoreBootstrap from "@/AuthStoreBootstrap";
import GeoLocationUpdater from "@/components/GeoLocationUpdater";
import { SocketProvider } from "@/SocketContext";

export default function SectionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <AuthStoreBootstrap />
      {children}
      <GeoLocationUpdater />
    </SocketProvider>
  );
}

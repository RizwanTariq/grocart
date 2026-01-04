import AuthStoreBootstrap from "@/AuthStoreBootstrap";

export default function SectionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthStoreBootstrap />
      {children}
    </>
  );
}

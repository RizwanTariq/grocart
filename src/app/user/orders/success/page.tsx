import OrderPlacedCard from "../../checkout/_components/OrderPlacedCard";

async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const orderNumber = (await searchParams).order_no;
  if (!orderNumber) {
    return null;
  }
  return <OrderPlacedCard orderNumber={orderNumber as string} />;
}

export default OrderSuccessPage;

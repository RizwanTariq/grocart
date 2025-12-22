import OrderPlacedCard from "../../checkout/_components/OrderPlacedCard";

async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const orderId = (await searchParams).order_id;
  if (!orderId) {
    return null;
  }
  return <OrderPlacedCard orderId={orderId as string} />;
}

export default OrderSuccessPage;

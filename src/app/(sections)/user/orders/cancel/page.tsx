import PaymentFailedCard from "./_components/PaymentFailedCard";

async function OrderCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const orderId = (await searchParams).order_id;
  const sessionId = (await searchParams).session_id;
  if (!orderId) {
    return null;
  }
  return (
    <PaymentFailedCard
      orderId={orderId as string}
      sessionId={sessionId as string}
    />
  );
}

export default OrderCancelPage;

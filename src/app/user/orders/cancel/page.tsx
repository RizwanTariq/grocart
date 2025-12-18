async function OrderCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const orderNumber = (await searchParams).order_no;
  if (!orderNumber) {
    return null;
  }
  return <div>{orderNumber}</div>;
}

export default OrderCancelPage;

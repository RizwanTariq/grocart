import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function OrderPlacedCard({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h2>
        <p className="text-gray-600 mb-6">
          Your order has been successfully placed. We&apos;ll deliver it soon!
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Order Number</p>
          <p className="text-2xl font-bold text-rose-600">#{orderNumber}</p>
        </div>
        <button
          onClick={() => router.push("/user/products")}
          className="w-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderPlacedCard;

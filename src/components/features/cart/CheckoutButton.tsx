import { ArrowRight } from "lucide-react";

function CheckoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="w-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <span className="text-sm lg:text-base">Proceed to Checkout</span>
      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
    </button>
  );
}

export default CheckoutButton;

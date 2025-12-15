import { ArrowRight } from "lucide-react";

function CheckoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="w-full bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer hover:scale-105 active:scale-95 transition-all"
      onClick={onClick}
    >
      <span className="text-sm lg:text-base">Proceed to Checkout</span>
      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
    </button>
  );
}

export default CheckoutButton;

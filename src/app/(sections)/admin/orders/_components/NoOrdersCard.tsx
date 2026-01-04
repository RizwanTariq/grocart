import { Package } from "lucide-react";
import { motion } from "motion/react";

function NoOrdersCard({ description }: { description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 md:p-16 text-center"
    >
      <div className="inline-flex p-6 bg-gray-50 rounded-full mb-6">
        <Package className="w-16 h-16 text-gray-300" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

export default NoOrdersCard;

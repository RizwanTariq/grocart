import { useState } from "react";

import { ORDER_STATUS } from "@/types/enums";
import { getStatusConfig } from "@/components/utils";

import CustomDropdown from "./CustomDropdown";

function OrderStatusSelector({
  orderId,
  orderStatus,
  loading,
  updateOrderStatus,
}: {
  orderId: string;
  orderStatus: ORDER_STATUS;
  loading: boolean;
  updateOrderStatus: (orderId: string, newStatus: ORDER_STATUS) => void;
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const config = getStatusConfig(orderStatus);

  return (
    <CustomDropdown
      isOpen={showStatusDropdown}
      onToggle={() => setShowStatusDropdown((prev) => !prev)}
      selectedId={orderStatus}
      selectedLabel={config.label}
      icon={config.icon}
      onSelect={(status) => {
        updateOrderStatus(orderId, status as ORDER_STATUS);
      }}
      loading={loading}
      list={Object.values(ORDER_STATUS).map((status) => ({
        id: status,
        label: getStatusConfig(status).label,
      }))}
      color={{
        text: config.textColor,
        bg: config.bgColor,
        border: config.borderColor,
      }}
    />
  );
}

export default OrderStatusSelector;

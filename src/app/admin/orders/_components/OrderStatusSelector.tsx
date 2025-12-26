import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { IOrder } from "@/types";
import { ORDER_STATUS } from "@/types/enums";
import { getStatusConfig } from "@/app/user/orders/_components/utils";

function OrderStatusSelector({
  order,
  loading,
  updateOrderStatus,
}: {
  order: IOrder;
  loading: boolean;
  updateOrderStatus: (orderId: string, newStatus: ORDER_STATUS) => void;
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const config = getStatusConfig(order.status);

  return (
    <CustomDropdown
      isOpen={showStatusDropdown}
      onToggle={() => setShowStatusDropdown((prev) => !prev)}
      selectedId={order.status}
      selectedLabel={config.label}
      icon={config.icon}
      onSelect={(status) => {
        updateOrderStatus(order._id, status as ORDER_STATUS);
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

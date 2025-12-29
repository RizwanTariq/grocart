import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { IOrderPopulated } from "@/types";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { getPaymentStatusConfig } from "@/app/user/orders/_components/utils";

function PaymentStatusSelector({
  order,
  loading,
  updatePaymentStatus,
}: {
  order: IOrderPopulated;
  loading: boolean;
  updatePaymentStatus: (orderId: string, newStatus: PAYMENT_STATUS) => void;
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const config = getPaymentStatusConfig(order.paymentStatus);
  const disabled = order.paymentMethod !== PAYMENT_METHOD.COD;
  return (
    <CustomDropdown
      isOpen={showStatusDropdown}
      onToggle={() => setShowStatusDropdown((prev) => !prev)}
      selectedId={order.paymentStatus}
      selectedLabel={config.label}
      icon={config.icon}
      disabled={disabled}
      onSelect={(status) => {
        updatePaymentStatus(order._id, status as PAYMENT_STATUS);
      }}
      loading={loading}
      list={Object.values(PAYMENT_STATUS).map((status) => ({
        id: status,
        label: getPaymentStatusConfig(status).label,
      }))}
      color={{
        text: config.textColor,
        bg: config.bgColor,
        border: config.borderColor,
      }}
    />
  );
}

export default PaymentStatusSelector;

import { useState } from "react";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { getPaymentStatusConfig } from "@/components/utils";
import CustomDropdown from "./CustomDropdown";

function PaymentStatusSelector({
  orderId,
  paymentStatus,
  paymentMethod,
  loading,
  updatePaymentStatus,
}: {
  orderId: string;
  paymentStatus: PAYMENT_STATUS;
  paymentMethod: PAYMENT_METHOD;
  loading: boolean;
  updatePaymentStatus: (orderId: string, newStatus: PAYMENT_STATUS) => void;
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const config = getPaymentStatusConfig(paymentStatus);
  const disabled = paymentMethod !== PAYMENT_METHOD.COD;
  return (
    <CustomDropdown
      isOpen={showStatusDropdown}
      onToggle={() => setShowStatusDropdown((prev) => !prev)}
      selectedId={paymentStatus}
      selectedLabel={config.label}
      icon={config.icon}
      disabled={disabled}
      onSelect={(status) => {
        updatePaymentStatus(orderId, status as PAYMENT_STATUS);
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

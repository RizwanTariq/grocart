import { getPaymentStatusLabelWithAll } from "@/app/user/orders/_components/utils";
import Dropdown from "@/components/common/Dropdown";
import { PAYMENT_STATUS } from "@/types/enums";
import { CreditCard } from "lucide-react";
import { useState } from "react";

function PaymentFilterSelector({
  onSelect,
  selected,
}: {
  onSelect: (status: PAYMENT_STATUS) => void;
  selected: PAYMENT_STATUS | "ALL";
}) {
  const options = ["ALL", ...Object.values(PAYMENT_STATUS)].map((status) => ({
    id: status,
    label: getPaymentStatusLabelWithAll(status as PAYMENT_STATUS),
  }));
  const [showDropdown, setShowDropdown] = useState(false);
  const handleSelect = (status: string) => {
    onSelect(status as PAYMENT_STATUS);
    setShowDropdown((prev) => !prev);
  };
  return (
    <Dropdown
      isOpen={showDropdown}
      onToggle={() => setShowDropdown((prev) => !prev)}
      list={options}
      selectedId={selected}
      selectedLabel={getPaymentStatusLabelWithAll(selected)}
      onSelect={handleSelect}
      icon={CreditCard}
    />
  );
}

export default PaymentFilterSelector;

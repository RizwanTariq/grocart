import { getOrderStatusLabelWithAll as getOrderStatusLabel } from "@/app/user/orders/_components/utils";
import Dropdown from "@/components/common/Dropdown";
import { ORDER_STATUS } from "@/types/enums";
import { Filter } from "lucide-react";
import { useState } from "react";

function StatusFilterSelector({
  onStatusSelect,
  selectedStatus,
}: {
  onStatusSelect: (status: ORDER_STATUS) => void;
  selectedStatus: ORDER_STATUS | "ALL";
}) {
  const options = ["ALL", ...Object.values(ORDER_STATUS)].map((status) => ({
    id: status,
    label: getOrderStatusLabel(status as ORDER_STATUS),
  }));

  const [showDropdown, setShowDropdown] = useState(false);
  const handleSelect = (status: string) => {
    onStatusSelect(status as ORDER_STATUS);
    setShowDropdown((prev) => !prev);
  };
  return (
    <Dropdown
      isOpen={showDropdown}
      onToggle={() => setShowDropdown((prev) => !prev)}
      list={options}
      selectedId={selectedStatus}
      selectedLabel={getOrderStatusLabel(selectedStatus)}
      onSelect={handleSelect}
      icon={Filter}
    />
  );
}

export default StatusFilterSelector;

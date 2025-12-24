import { cn } from "@/utils/cn";
import { LogOut } from "lucide-react";

function LogoutButton({
  isNav = false,
  handleLogOut,
}: {
  isNav?: boolean;
  handleLogOut: () => Promise<void>;
}) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-3 w-full px-4 py-3 bg-red-500/30 hover:bg-red-500/50 hover:scale-[102%] active:scale-[98%] rounded-xl text-white font-medium transition-all shadow-lg cursor-pointer",
        isNav && "bg-red-500! hover:bg-red-500/95! px-3! py-2.5!"
      )}
      onClick={handleLogOut}
    >
      <LogOut className="h-5 w-5" />
      <span>Log Out</span>
    </button>
  );
}

export default LogoutButton;

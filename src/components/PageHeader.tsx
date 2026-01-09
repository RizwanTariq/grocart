import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

function PageHeader({
  icon: Icon,
  title,
  subTitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subTitle: string;
} & React.PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mb-8",
        children && "flex flex-col sm:flex-row sm:justify-between"
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="hidden sm:flex w-14 h-14 bg-linear-to-br from-rose-500 to-pink-600 rounded-xl sm:rounded-2xl  items-center justify-center shadow-lg shadow-rose-500/30">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-gray-600 mt-1">{subTitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default PageHeader;

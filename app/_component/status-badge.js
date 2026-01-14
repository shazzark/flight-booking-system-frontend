import { cn } from "../utilis";

const statusStyles = {
  pending: "bg-status-pending/20 text-status-pending border-status-pending/30",
  confirmed:
    "bg-status-confirmed/20 text-status-confirmed border-status-confirmed/30",
  completed:
    "bg-status-confirmed/20 text-status-confirmed border-status-confirmed/30",
  cancelled:
    "bg-status-cancelled/20 text-status-cancelled border-status-cancelled/30",
  failed:
    "bg-status-cancelled/20 text-status-cancelled border-status-cancelled/30",
  expired: "bg-status-expired/20 text-status-expired border-status-expired/30",
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}

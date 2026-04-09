import clsx from "clsx";

const statusStyles: Record<string, string> = {
  created:                  "badge-created",
  triaged:                  "badge-triaged",
  context_retrieved:        "badge-processing",
  tools_selected:           "badge-processing",
  tools_executed:           "badge-processing",
  recommendation_generated: "badge-processing",
  safety_checked:           "badge-review",
  awaiting_review:          "badge-review",
  approved:                 "badge-approved",
  rejected:                 "badge-rejected",
  escalated:                "badge-escalated",
  completed:                "badge-completed",
  failed_safe:              "badge-rejected",
};

const priorityStyles: Record<string, string> = {
  low:      "badge-low",
  medium:   "badge-medium",
  high:     "badge-high",
  critical: "badge-critical",
};

interface BadgeProps {
  type: "status" | "priority";
  value: string;
  className?: string;
}

export function Badge({ type, value, className }: BadgeProps) {
  const styles = type === "status" ? statusStyles : priorityStyles;
  const label  = value.replace(/_/g, " ");
  return (
    <span className={clsx("badge", styles[value] || "badge-created", className)}>
      {label}
    </span>
  );
}

import { TaskStatus, IssueType } from "@/types";

const statusStyles: Record<TaskStatus, string> = {
  Pending: "status-pending",
  Accepted: "bg-accent text-accent-foreground",
  Rejected: "status-critical",
  Completed: "status-normal",
};

const issueStyles: Record<IssueType, string> = {
  Leakage: "status-critical",
  "Temperature Fault": "status-pending",
  Offline: "status-offline",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function IssueBadge({ type }: { type: IssueType }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${issueStyles[type]}`}>
      {type}
    </span>
  );
}

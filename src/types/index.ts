export type TaskStatus = "Pending" | "Accepted" | "Rejected" | "Completed";
export type IssueType = "Leakage" | "Temperature Fault" | "Offline";
export type Priority = "High" | "Medium" | "Low";

export interface FilterInfo {
  filterId: string;
  locationName: string;
  district: string;
  temperature: number;
  flowRate: number;
  waterUsedToday: number;
  totalUsage: number;
  hotWaterStatus: string;
  coldWaterStatus: string;
  leakageStatus: string;
  operationalStatus: string;
  lastUpdated: string;
}

export interface Task {
  taskId: string;
  filterId: string;
  locationName: string;
  district: string;
  issueType: IssueType;
  description: string;
  priority: Priority;
  assignedTechnicianId: string;
  status: TaskStatus;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  role: string;
  availabilityStatus: string;
}

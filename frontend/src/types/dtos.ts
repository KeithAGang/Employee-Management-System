export interface EmployeeShort {
  fullName: string;
  email: string;
}

export interface NotificationDto {
  message: string;
  isRead: boolean;
}

export interface ManagerProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  subordinates: EmployeeShort[];
  notifications: NotificationDto[];
  isActive: boolean;
}

export interface LeaveApplicationDto {
  applicationId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface EmployeeProfileDto {
  fullName: string;
  email: string;
  position: string;
  jobTitle: string;
  dateHired: string;
  managerName: string | null;
  managerEmail: string | null;
  leaveApplications: LeaveApplicationDto[];
  notifications: any[]; // As per your backend DTO, this is an empty array here
  leaveDaysTaken: number;
  totalLeaveDays: number;
}
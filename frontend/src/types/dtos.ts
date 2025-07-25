export interface EmployeeShort {
  fullName: string;
  email: string;
  leaveApplications: LeaveApplicationDto[];
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
  officeLocation: string;
  subordinates: EmployeeShort[];
  notifications: NotificationDto[];
  isActive: boolean;
}

export interface LeaveApplicationDto {
  applicationId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
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

export interface UpdateManagerProfileDto {
  firstName?: string | null;
  lastName?: string | null;
  department?: string | null;
  officeLocation?: string | null;
}

export interface LeaveApplicationIdDto {
  applicationId: string;
}

export interface GetSalesDtoEx {
  salesRecordId: string;
  customerName: string;
  subordinateName: string;
  saleDate: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  notes?: string | null;
}

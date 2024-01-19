import { EquipmentStatus } from './equipment.type';

export interface StatisticDashboard {
  countByDepartment: CountEquipmentByDepartment[];
  countByRiskLevels: CountEquipmentByRiskLevel[];
  countByEquipmentStatuses: CountEquipmentByStatus[];
  countRepairingByDepartment: CountEquipmentByDepartment[];
  countBrokenByDepartment: CountEquipmentByDepartment[];
  countEquipmentByDepartmentAndStatus: CountEquipmentByDepartment[];
}

export interface CountEquipmentByGroupAndCategory {
  groupId: number,
  groupName: string;
  count: number;
  countByCategoryList: CountEquipmentByCategory[];
}

export interface CountEquipmentByCategory {
  categoryId: number,
  categoryName: string;
  count: number;
}

export interface CountEquipmentByDepartment {
  departmentId: number;
  departmentName: string;
  count: number;
  // countByEquipmentStatus: Map<EquipmentStatus, number>;
}

export interface CountEquipmentByDepartmentAndStatus {
  departmentId: number;
  departmentName: string;
  count: number;
  countByEquipmentStatus: Map<EquipmentStatus, number>;
}

export interface CountEquipmentByDepartmentAndStatusDto {
  departmentId: number;
  departmentName: string;
  newCount: number | undefined;
  inUseCount: number | undefined;
  brokenCount: number | undefined;
  repairingCount: number | undefined;
  inactiveCount: number | undefined;
  liquidatedCount: number | undefined;
  count: number;
}
export interface CountEquipmentByRiskLevel {
  riskLevel: string;
  count: number;
}
export interface CountEquipmentByStatus {
  status: EquipmentStatus;
  count: number;
  image?: any; //image url for frontend (not response from backend)
}

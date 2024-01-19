import { TicketStatus } from './reportBroken.type';
import { UserDto } from './user.type';
import { EquipmentDto, EquipmentStatus } from './equipment.type';
import { SupplierDto } from './supplier.type';
import { Moment } from 'moment';
import { HasAttachments, HasTicketStatus } from './trait.type';

export interface RepairTicketDto {
  id: number;
  code: string;
  createdDate: string;
  creatorNote: string;
  approvalDate: string;
  approverNote: string;
  status: TicketStatus;
  estimatedCost: number;
  repairStatus: RepairStatus;
  repairStartDate: string;
  repairEndDate: string;
  actualCost: number;
}

export enum RepairPriority {
  LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH'
}

export enum RepairStatus {
  IN_PROGRESS = 'IN_PROGRESS', DONE = 'DONE', CAN_NOT_REPAIR = 'CAN_NOT_REPAIR'
}

export interface CreateRepairTicketForm {
  createdDate?: string;
  creatorNote?: string;
  estimatedCost?: number;
  repairStartDate?: string;
  repairCompanyId?: number;
}

export interface RepairTicketFullInfoDto extends HasTicketStatus, HasAttachments {
  id?: number;
  code?: string;
  creator?: UserDto;
  createdDate?: string;
  creatorNote?: string;
  approvalDate?: string;
  approverNote?: string;
  approver?: UserDto;

  equipment?: EquipmentDto;
  estimatedCost?: number;
  repairStatus?: RepairStatus;
  repairStartDate?: string;
  repairEndDate?: string;
  actualCost?: number;
  repairCompany?: SupplierDto;
}

export interface AcceptRepairTicketForm {
  approvalDate?: string | Moment;
  approverNote?: string;
  isAccepted?: boolean;
}

export interface UpdateRepairTicketForm {
  repairStatus: RepairStatus;
  repairEndDate: string;
  actualCost?: number;
  repairNote?: string;
}

export interface GetEquipmentsForRepairQueryParam {
  keyword?: string;
  equipmentStatus?: EquipmentStatus | string;
  departmentId?: number;
  categoryId?: number;
  groupId?: number;
}

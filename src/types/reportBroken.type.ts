import { RepairPriority } from './repair.type';
import { UserDto } from './user.type';
import { EquipmentDto, EquipmentStatus } from './equipment.type';
import { Moment } from 'moment';
import { FileStorageDto } from './fileStorage.type';
import { HasAttachments, HasTicketStatus } from './trait.type';

export interface CreateReportBrokenTicketForm {
  createdDate: string | Moment;
  creatorNote?: string;
  reason?: string;
  priority?: RepairPriority;
}

export interface ReportBrokenTicketFullInfoDto extends HasTicketStatus, HasAttachments{
  id?: number;
  code?: string;
  creator?: UserDto;
  createdDate?: Moment | string;
  creatorNote?: string;
  approvalDate?: Moment | string;
  approverNote?: string;
  approver?: UserDto;
  equipment?: EquipmentDto;
  reason?: string;
  priority?: RepairPriority;
}


export interface ReportBrokenTicketDto {
  id: number;
  code: string;
  createdDate: string;
  creatorNote: string;
  approvalDate: string;
  approverNote: string;
  status: TicketStatus;
  reason: string;
  priority: RepairPriority;
}

export enum TicketStatus {
  PENDING = 'PENDING', ACCEPTED = 'ACCEPTED', REJECTED = 'REJECTED',
}

export interface AcceptReportBrokenTicketForm {
  approverNote?: string;
  isApproved?: boolean;
  approvalDate?: Moment;
}


export interface GetEquipmentsForReportBrokenQueryParam {
  keyword?: string;
  equipmentStatus?: EquipmentStatus | string;
  departmentId?: number;
  categoryId?: number;
  groupId?: number;
  reportBrokenDateFrom?: Moment | string;
  reportBrokenDateTo?: Moment | string;
}
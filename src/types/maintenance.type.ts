import { EquipmentDto, EquipmentStatus } from './equipment.type';
import { UserDto } from './user.type';
import { TicketStatus } from './reportBroken.type';
import { FileStorageDto } from './fileStorage.type';
import moment, { Moment } from 'moment';
import { SupplierDto } from './supplier.type';
import { HasAttachments, HasTicketStatus } from './trait.type';

export interface GetEquipmentsForMaintenanceQueryParam {
  keyword?: string;
  equipmentStatus?: EquipmentStatus | string;
  departmentId?: number;
  categoryId?: number;
  groupId?: number;
  maintenanceDateFrom?: string | moment.Moment | number;
  maintenanceDateTo?: string | moment.Moment | number;
  nextTimeFrom?: string | moment.Moment | number;
  nextTimeTo?: string | moment.Moment | number;
  regularMaintenance?: number;
}

export interface MaintenanceTicketListDto extends HasTicketStatus, HasAttachments{
  id?: number;
  code?: string;
  creator?: UserDto;
  createdDate?: string;
  creatorNote?: string;
  approvalDate?: string;
  approverNote?: string;
  approver?: UserDto;

  equipment?: EquipmentDto;
  maintenanceDate?: string;
  nextTime?: string;
  maintenanceNote?: string;
  price?: number;
}

export interface MaintenanceTicketDto extends HasTicketStatus{
  id?: number;
  maintenanceDate?: string;
  nextTime?: string;
  maintenanceNote?: string;
  price?: number;
  code?: string;
  createdDate?: string;
  creatorNote?: string;
  approvalDate?: string;
  approverNote?: string;

}

export interface CreateMaintenanceTicketForm {
  createdDate?: string | moment.Moment;
  creatorNote?: string;
}

export interface MaintenanceTicketFullInfoDto extends HasTicketStatus, HasAttachments{
  id?: number;
  code?: string;
  creator?: UserDto;
  createdDate?: string | Moment;
  creatorNote?: string;
  approvalDate?: string | Moment;
  approverNote?: string;
  approver?: UserDto
  equipment?: EquipmentDto;
  maintenanceDate?: string | Moment;
  nextTime?: string | Moment;
  maintenanceNote?: string;
  price?: number;
  maintenanceCompany?: SupplierDto;
}

export interface UpdateMaintenanceTicketForm {
  maintenanceDate?: string | Moment;
  maintenanceNote?: string;
  maintenanceCompanyId?: number;
  price?: number;
}

export interface AcceptMaintenanceTicketForm {
  approvalDate?: string | Moment;
  approverNote?: string;
  isApproved?: boolean;
}
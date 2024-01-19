import { EquipmentDto, EquipmentStatus } from './equipment.type';
import { UserDto } from './user.type';
import { DepartmentDto } from './department.type';
import { FileStorageDto } from './fileStorage.type';
import { TicketStatus } from './reportBroken.type';
import { Moment } from 'moment';
import { HasAttachments, HasTicketStatus } from './trait.type';

export interface CreateHandoverTicketForm {
  handoverDate?: string | Moment; // Assuming LocalDate is converted to string
  responsiblePersonId?: number;
  departmentId?: number;
  createdDate?: string | Moment;
  handoverNote?: string;
  creatorNote?: string;
}

export interface DataHandover {
  name?: String,
  equipmentId?: number,
  createdById?: number,

}

export interface HandoverDto extends HasTicketStatus{
  id: number;
  handoverDate: string;
  responsiblePerson: UserDto;
  note: string;
  department: DepartmentDto;
  createdBy: UserDto;
  approver: UserDto;
  approvalDate: string;
  approverNote: string;
}

export interface HandoverTicketFullInfoDto extends HasTicketStatus, HasAttachments{
  id?: number;
  code?: string;
  department?: DepartmentDto | null | undefined; // optional
  creator?: UserDto | null | undefined; // optional
  createdDate?: Moment | string | null | undefined; // optional
  creatorNote?: string | null | undefined; // optional
  approvalDate?: Moment | string | null | undefined; // optional
  approverNote?: string | null | undefined; // optional
  approver?: UserDto | null | undefined; // optional
  equipment?: EquipmentDto | null | undefined; // optional
  handoverDate?: Moment | string | null | undefined; // optional
  responsiblePerson?: UserDto | null | undefined; // optional
  handoverNote?: string | null | undefined; // optional
}


export interface AcceptHandoverTicketForm {
  isApproved?: boolean;
  approverNote?: string;
  approvalDate?: string | Moment; // Assuming LocalDate is converted to string
}

export enum HandoverStatus {
  PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED'
}

export interface GetEquipmentsForHandoverQueryParam {
  keyword?: string | null | undefined; // optional
  equipmentStatus?: EquipmentStatus | string | null | undefined; // optional
  departmentId?: number | null | undefined; // optional
  categoryId?: number | null | undefined; // optional
  groupId?: number | null | undefined; // optional
  handoverDateFrom?: Moment | string | null | undefined; // optional
  handoverDateTo?: Moment | string | null | undefined; // optional
}

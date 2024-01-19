import { UserDto } from './user.type';
import { EquipmentDto } from './equipment.type';
import { DepartmentDto } from './department.type';
import { FileStorageDto } from './fileStorage.type';
import moment, { Moment } from 'moment';
import { HasAttachments, HasTicketStatus } from './trait.type';

export interface TransferDto {
  id?: number;
  fromDepartmentName?: string;
  toDepartmentName?: string;
  dateTransfer?: string;
  note?: string;
  approverName?: string;
  approverUsername?: string;
}

export interface CreateTransferTicketForm {
  toDepartmentId?: number;
  dateTransfer?: moment.Moment | string;
  createdDate?: moment.Moment | string;
  creatorNote?: string;
  transferNote?: string;
}

export interface TransferTicketFullInfoDto extends HasTicketStatus, HasAttachments {
  id?: number;
  code?: string;
  creator?: UserDto;
  createdDate?: string;
  creatorNote?: string;
  approvalDate?: string;
  approverNote?: string;
  approver?: UserDto;
  equipment?: EquipmentDto;
  fromDepartment?: DepartmentDto;
  toDepartment?: DepartmentDto;
  dateTransfer?: string;
  transferNote?: string;

}

export interface AcceptTransferTicketForm {
  approvalDate?: string | moment.Moment;
  approverNote?: string;
  isApproved?: boolean;
}

export interface TransferListDto extends HasTicketStatus, HasAttachments {
  id?: number;
  code?: string;
  creator?: UserDto;
  createdDate?: string;
  creatorNote?: string;
  approvalDate?: string;
  approverNote?: string;
  approver?: UserDto;

  equipment?: EquipmentDto;
  fromDepartment?: DepartmentDto;
  toDepartment?: DepartmentDto;
  dateTransfer?: string;
  transferNote?: string;

}

export interface GetTransfersQueryParam extends HasTicketStatus {
  keyword?: string;

}

export interface TransferTicketDto {
  id?: number;
  fromDepartmentName?: string;
  toDepartmentName?: string;
  dateTransfer?: string | Moment;
  note?: string;
  approverName?: string;
  approverUsername?: string;
}
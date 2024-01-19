import { Moment } from 'moment';

import { EquipmentDto, EquipmentStatus } from './equipment.type';
import { FileStorageDto } from './fileStorage.type';
import { UserDto } from './user.type';
import { HasAttachments, HasTicketStatus } from './trait.type';

export interface LiquidationDto extends HasTicketStatus{
  id?: number;
  code?: string;
  createdDate?: string | Moment;
  creatorNote?: string;
  approvalDate?: string | Moment;
  approverNote?: string;

  liquidationDate?: string | Moment;
  liquidationNote?: string;
  price?: number;
}

export interface GetEquipmentsForLiquidationQueryParam {
  keyword?: string;
  equipmentStatus?: EquipmentStatus | string;
  departmentId?: number;
  categoryId?: number;
  groupId?: number;
  liquidationDateFrom?: string | Moment;
  liquidationDateTo?: string | Moment;
}

export interface CreateLiquidationTicketForm {
  createdDate?: string | Moment;
  creatorNote?: string;
  liquidationDate?: string | Moment;
  liquidationNote?: string;
  price?: number;
}
export interface LiquidationTicketFullInfoDto extends HasTicketStatus, HasAttachments{
  id?: number;
  code?: string;
  creator?: UserDto;
  createdDate?: string | Moment;
  creatorNote?: string;
  approvalDate?: string | Moment;
  approverNote?: string;
  approver?: UserDto;
  liquidationDate?: string | Moment;
  equipment?: EquipmentDto;
  liquidationNote?: string;
  price?: number;

}

export interface AcceptLiquidationTicketForm {
  approvalDate?: string | Moment;
  approverNote?: string;
  isApproved?: boolean;
}
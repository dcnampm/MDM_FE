import { Moment } from 'moment';
import { TicketStatus } from './reportBroken.type';
import moment from 'moment/moment';
import { FileStorageDto } from './fileStorage.type';
import { SupplierDto } from './supplier.type';
import { EquipmentDto } from './equipment.type';
import { UserDto } from './user.type';
import { HasAttachments, HasTicketStatus } from './trait.type';

export interface InspectionTicketDto extends HasTicketStatus{
  id?: number;
  code?: string;
  createdDate?: string | Moment;
  creatorNote?: string;
  approvalDate?: string | Moment;
  approverNote?: string;

  inspectionDate?: string | Moment;
  nextTime?: string | Moment;
  inspectionNote?: string;
  price?: number;
}

export interface GetEquipmentsForInspectionQueryParam {
  keyword?: string;
  equipmentStatus?: string;
  departmentId?: number;
  categoryId?: number;
  groupId?: number;
  lastTimeFrom?: string | Moment;
  lastTimeTo?: string | Moment;
  nextTimeFrom?: string | Moment;
  nextTimeTo?: string | Moment;
  regularInspection?: number;
}

export interface CreateInspectionTicketForm {
  createdDate?: string | moment.Moment;
  creatorNote?: string;
}

export interface InspectionTicketFullInfoDto extends HasTicketStatus, HasAttachments{
  id?: number;
  code?: string;
  creator?: UserDto;
  createdDate?: string;
  creatorNote?: string;
  approvalDate?: string;
  approverNote?: string;
  approver?: UserDto;

  equipment?: EquipmentDto;
  inspectionDate?: string;
  inspectionNote?: string;
  price?: number;
  inspectionCompany?: SupplierDto;
  evaluationStatus?: InspectionEvaluationStatus;
}

export interface UpdateInspectionTicketForm {
  inspectionDate?: string | Moment;
  inspectionNote?: string;
  inspectionCompanyId?: number;
  price?: number;
  evaluationStatus?: InspectionEvaluationStatus;
}

export enum InspectionEvaluationStatus {
  GOOD = 'GOOD', BAD_CAN_REPAIR = 'BAD_CAN_REPAIR', BAD_CANNOT_REPAIR = 'BAD_CANNOT_REPAIR'
}

export interface AcceptInspectionTicketForm {
  approvalDate?: string | Moment;
  approverNote?: string;
  isApproved?: boolean;
}

export interface ClinicEnvironmentInspectionDto { //TODO: clinicEnvironmentInspectionDto
}


export interface ExternalQualityAssessmentDto { //TODO: externalQualityAssessmentDto
}

export interface CVRadiationDto { // TODO: cvRadiationDto
}

export interface RadiationInspectionDto { // TODO: radiationInspectionDto
}
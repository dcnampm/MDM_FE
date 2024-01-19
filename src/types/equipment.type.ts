import { DepartmentDto, DepartmentFullInfoDto } from './department.type';
import { EquipmentCategoryDto, EquipmentCategoryFullInfoDto } from './equipmentCategory.type';
import { EquipmentUnitDto } from './equipmentUnit.type';
import { HandoverTicketFullInfoDto } from './handover.type';
import { EquipmentSupplyUsageDto } from './equipmentSupplyUsage.type';
import { ProjectDto } from './project.type';
import { InspectionTicketDto, InspectionTicketFullInfoDto } from './equipmentInspection.type';
import { SupplierFullInfoDto } from './supplier.type';
import { TransferTicketFullInfoDto } from './transfer.type';
import { InventoryDto } from './inventory.type';
import { ReportBrokenTicketFullInfoDto } from './reportBroken.type';
import { RepairTicketFullInfoDto } from './repair.type';
import { MaintenanceTicketDto, MaintenanceTicketFullInfoDto } from './maintenance.type';
import { Moment } from 'moment';
import { LiquidationDto, LiquidationTicketFullInfoDto } from './equipmentLiquidation.type';
import { FileStorageDto } from './fileStorage.type';
import { HasAttachments } from './trait.type';
import useFormInstance from 'antd/lib/form/hooks/useFormInstance';
import { FormInstance } from 'antd';


export enum EquipmentStatus {
  NEW = 'NEW',
  IN_USE = 'IN_USE',
  BROKEN = 'BROKEN',
  INACTIVE = 'INACTIVE',
  REPAIRING = 'REPAIRING',
  LIQUIDATED = 'LIQUIDATED',
  PENDING_TRANSFER = 'PENDING_TRANSFER',
  PENDING_HANDOVER = 'PENDING_HANDOVER',
  PENDING_REPORT_BROKEN = 'PENDING_REPORT_BROKEN',
  PENDING_ACCEPT_REPAIR = 'PENDING_ACCEPT_REPAIR',
  PENDING_ACCEPT_MAINTENANCE = 'PENDING_ACCEPT_MAINTENANCE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  PENDING_ACCEPT_INSPECTION = 'PENDING_ACCEPT_INSPECTION',
  UNDER_INSPECTION = 'UNDER_INSPECTION',
  PENDING_ACCEPT_LIQUIDATION = 'PENDING_ACCEPT_LIQUIDATION'
}

export interface EquipmentListDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: string;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  category?: EquipmentCategoryDto;
  department?: DepartmentDto;
  regularMaintenance?: number;
  regularInspection?: number;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string;
  warrantyExpirationDate?: string;
  deleted?: boolean;
  imageIds?: number[];
  unit?: EquipmentUnitDto;
}

export interface GetEquipmentsQueryParam {
  keyword?: string;
  status?: EquipmentStatus | string;
  riskLevel?: RiskLevel | string;
  warehouseImportDateFrom?: string; // Assuming LocalDate is converted to string
  warehouseImportDateTo?: string; // Assuming LocalDate is converted to string
  yearOfManufactureFrom?: number; // Assuming Year is converted to number
  yearOfManufactureTo?: number; // Assuming Year is converted to number
  yearInUseFrom?: number; // Assuming Year is converted to number
  yearInUseTo?: number; // Assuming Year is converted to number
  importPriceFrom?: number;
  importPriceTo?: number;
  initialValueFrom?: number;
  initialValueTo?: number;
  supplierId?: number;
  categoryId?: number;
  departmentId?: number;
  projectId?: number;
  groupId?: number;
  jointVentureContractExpirationDateFrom?: string; // Assuming LocalDate is converted to string
  jointVentureContractExpirationDateTo?: string; // Assuming LocalDate is converted to string
  warrantyExpirationDateFrom?: string; // Assuming LocalDate is converted to string
  warrantyExpirationDateTo?: string; // Assuming LocalDate is converted to string
  lastMaintenanceDateFrom?: string; // Assuming LocalDate is converted to string
  lastMaintenanceDateTo?: string; // Assuming LocalDate is converted to string
  lastInspectionDateFrom?: string; // Assuming LocalDate is converted to string
  lastInspectionDateTo?: string; // Assuming LocalDate is converted to string
}


export enum RiskLevel {
  A = 'A', B = 'B', C = 'C', D = 'D'
}

export interface EquipmentDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  technicalParameter?: string;
  warehouseImportDate?: string; // Assuming LocalDate is converted to string
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  supplierId?: number;
  departmentId?: number;
  projectId?: number;
  riskLevel?: RiskLevel;
  categoryId?: number;
  regularMaintenance?: number;
  regularInspection?: number;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string; // Assuming LocalDate is converted to string
  warrantyExpirationDate?: string; // Assuming LocalDate is converted to string
}

export interface EquipmentFullInfoDto extends HasAttachments{
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  qrCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: Moment;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string | undefined;
  category?: EquipmentCategoryFullInfoDto;
  department?: DepartmentFullInfoDto;
  regularMaintenance?: number;
  regularInspection?: number;
  jointVentureContractExpirationDate?: Moment;
  warrantyExpirationDate?: Moment;
  equipmentSupplyUsages?: EquipmentSupplyUsageDto[];
  project?: ProjectDto;
  inspectionTickets?: InspectionTicketFullInfoDto[];
  supplier?: SupplierFullInfoDto;
  handoverTickets?: HandoverTicketFullInfoDto[];
  inventories?: InventoryDto[];
  deleted?: boolean;
  unit?: EquipmentUnitDto;
  repairTickets?: RepairTicketFullInfoDto[];
  reportBrokenTickets?: ReportBrokenTicketFullInfoDto[];
  maintenanceTickets?: MaintenanceTicketFullInfoDto[];
  transferTickets?: TransferTicketFullInfoDto[];
  liquidationTickets?: LiquidationTicketFullInfoDto[];
}


export interface EquipmentListRepairDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: string;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  category?: EquipmentCategoryDto;
  department?: DepartmentDto;
  regularMaintenance?: number;
  regularInspection?: number;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string;
  warrantyExpirationDate?: string;
  repairTickets?: RepairTicketFullInfoDto[];
  reportBrokenTickets?: ReportBrokenTicketFullInfoDto[];
  deleted?: boolean;
}

export interface EquipmentListMaintenanceDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: string;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  category?: EquipmentCategoryDto;
  department?: DepartmentDto;
  regularMaintenance?: number;
  regularInspection?: number;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string;
  warrantyExpirationDate?: string;
  maintenanceTickets?: MaintenanceTicketFullInfoDto[];
  deleted?: boolean;
  lastMaintenanceDate?: string|Moment;
  nextMaintenanceDate?: string|Moment;
}

export interface EquipmentListInspectionDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: string | Moment;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  category?: EquipmentCategoryDto;
  department?: DepartmentDto;
  regularMaintenance?: number;
  regularInspection?: number;
  lastInspectionDate?: string | Moment;
  nextInspectionDate?: string | Moment;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string | Moment;
  warrantyExpirationDate?: string | Moment;
  inspectionTickets?: InspectionTicketDto[];
  deleted?: boolean;
}

export interface EquipmentListLiquidationDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: string | Moment;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  category?: EquipmentCategoryDto;
  department?: DepartmentDto;
  regularMaintenance?: number;
  regularInspection?: number;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string | Moment;
  warrantyExpirationDate?: string | Moment;
  liquidationTickets?: LiquidationTicketFullInfoDto[];
  deleted?: boolean;
}

export interface GetEquipmentsForTransferQueryParam {
  keyword?: string;
  equipmentStatus?: EquipmentStatus | string;
  departmentId?: number;
  categoryId?: number;
  groupId?: number;
}

export interface EquipmentListTransferDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: string | Moment;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  category?: EquipmentCategoryDto;
  department?: DepartmentDto;
  regularMaintenance?: number;
  regularInspection?: number;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string | Moment;
  warrantyExpirationDate?: string | Moment;
  transferTickets?: TransferTicketFullInfoDto[];
  deleted?: boolean;
}

export interface EquipmentListHandoverDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: string | Moment;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  category?: EquipmentCategoryDto;
  department?: DepartmentDto;
  regularMaintenance?: number;
  regularInspection?: number;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string | Moment;
  warrantyExpirationDate?: string | Moment;
  handoverTickets?: HandoverTicketFullInfoDto[];
  deleted?: boolean;
}

export interface EquipmentListReportBrokenDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: string | Moment;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  category?: EquipmentCategoryDto;
  department?: DepartmentDto;
  regularMaintenance?: number;
  regularInspection?: number;
  regularRadiationInspection?: number;
  regularExternalQualityAssessment?: number;
  regularClinicEnvironmentInspection?: number;
  regularCVRadiation?: number;
  jointVentureContractExpirationDate?: string | Moment;
  warrantyExpirationDate?: string | Moment;
  reportBrokenTickets?: ReportBrokenTicketFullInfoDto[];
  deleted?: boolean;
}

export interface UpsertEquipmentForm {
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  riskLevel?: RiskLevel;
  technicalParameter?: string;
  warehouseImportDate?: Moment;
  yearOfManufacture?: number;
  yearInUse?: number;
  configuration?: string;
  importPrice?: number;
  initialValue?: number;
  annualDepreciation?: number;
  usageProcedure?: string;
  note?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  categoryId?: number;
  departmentId?: number;
  regularMaintenance?: number;
  regularInspection?: number;
  jointVentureContractExpirationDate?: Moment | string;
  warrantyExpirationDate?: Moment | string;
  projectId?: number;
  supplierId?: number;
  deleted?: boolean;
  unitId?: number;
  groupId?: number;
}

export interface AttachSupplyForm {
  equipmentId?: number;
  supplyId?: number;
  amount?: number;
  amountUsed?: number;
  note?: string;
}

export interface EquipmentImportExcelForm extends FormInstance {
  departmentId? : number;
  status?: EquipmentStatus;
  excelFile?: File;
}
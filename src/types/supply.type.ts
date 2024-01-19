import { SupplyUnitDto } from './supplyUnit.type';
import { RiskLevel } from './equipment.type';
import { SupplierDto } from './supplier.type';
import { ProjectDto } from './project.type';
import { EquipmentSupplyUsageDto } from './equipmentSupplyUsage.type';
import { Moment } from 'moment';

export interface SupplyDto {
  id: number;
  name: string;
  amountUsed: number;
  amount: number;
  warehouseImportDate: string;
  yearOfManufacture: number;
  unit: SupplyUnitDto;
  status: SupplyStatus;
  model: string;
  serial: string;
  code: string;
  hashCode: string;
  yearInUse: number;
  importPrice: number;
  riskLevel: RiskLevel;
  manufacturer: string;
  manufacturingCountry: string;
  expiryDate: string;
  technicalParameter: string;
  configuration: string;
  usageProcedure: string;
  note: string;
  createAt: string;
  updateAt: string;
}

enum SupplyStatus {
  NEW = 'NEW', GOOD = 'GOOD', BAD = 'BAD', LOST = 'LOST', BROKEN = 'BROKEN', TRANSFERRED = 'TRANSFERRED', LIQUIDATED = 'LIQUIDATED'
}

export interface SupplyFullInfoDto {
  id?: number;
  name?: string;
  model?: string;
  serial?: string;
  code?: string;
  hashCode?: string;
  amountUsed?: number;
  amount?: number;
  warehouseImportDate?: string; // Use string instead of Date
  yearOfManufacture?: number;
  yearInUse?: number;
  importPrice?: number;
  equipmentSupplyUsages?: EquipmentSupplyUsageDto[];
  project?: ProjectDto;
  unit?: SupplyUnitDto;
  category?: SupplyCategoryDto;
  riskLevel?: RiskLevel;
  status?: SupplyStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  supplier?: SupplierDto;
  expiryDate?: string; // Use string instead of Date
  technicalParameter?: string;
  configuration?: string;
  usageProcedure?: string;
  note?: string;
}

export interface SupplyCategoryDto {
  id: number;
  name: string;
  alias: string;
  note: string;
}

export interface GetSupplyQueryParam {
  keyword?: string;
}

export interface UpsertSupplyForm {
  name?: string;
  model?: string;
  serial?: string;
  amount?: number;
  yearOfManufacture?: number;
  yearInUse?: number;
  importPrice?: number;
  status?: SupplyStatus;
  manufacturer?: string;
  manufacturingCountry?: string;
  expiryDate?: Moment | string;
  technicalParameter?: string;
  configuration?: string;
  usageProcedure?: string;
  note?: string;
  code?: string;
  hashCode?: string;
  amountUsed?: number;
  warehouseImportDate?: Moment | string;
  unitId?: number;
  supplierId?: number;
  projectId?: number;
  categoryId?: number;
  riskLevel?: RiskLevel;
}

export interface GetSupplyCategoriesQueryParam {
  keyword?: string;
}
export interface UpsertSupplyCategoryForm {
  id?: number;
  name?: string;
  alias?: string;
  note?: string;
}

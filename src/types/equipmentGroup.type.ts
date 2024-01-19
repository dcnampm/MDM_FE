import { EquipmentCategoryDto } from './equipmentCategory.type';

export interface EquipmentGroupDto {
  id: number;
  name: string;
  note: string;
  alias: string;
}

export interface GetEquipmentGroupsQueryParam {
  keyword?: string;
}

export interface EquipmentGroupFullInfoDto {
  id?: number;
  name?: string;
  note?: string;
  alias?: string;
  equipmentCategories?: EquipmentCategoryDto[];
}

export interface UpsertEquipmentGroupForm {
  name?: string;
  note?: string;
  alias?: string;
}
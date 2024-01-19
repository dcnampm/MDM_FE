import { EquipmentGroupDto } from './equipmentGroup.type';

export interface EquipmentCategoryDto {
  id?: number;
  name?: string;
  note?: string;
  alias?: string;
  group?: EquipmentGroupDto;
}

export interface EquipmentCategoryListDto extends EquipmentCategoryDto {
  group?: EquipmentGroupDto;
}

export interface EquipmentCategoryFullInfoDto extends EquipmentCategoryDto {
  group?: EquipmentGroupDto;
}

export interface GetEquipmentCategoriesQueryParam {
  keyword?: string;
  groupId?: number;
}
export interface UpsertEquipmentCategoryForm{
  name?: string;
  note?: string;
  alias?: string;
  groupId?: number;
}
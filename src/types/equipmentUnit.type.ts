export interface EquipmentUnitDto {
  id?: number;
  name?: string;
  note?: string;
}

export interface UpsertEquipmentUnitForm {
  name?: string;
  note?: string;
}

export interface GetEquipmentUnitsQueryParam {
  keyword?: string;
}

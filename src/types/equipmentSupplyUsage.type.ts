import { EquipmentDto } from './equipment.type';
import { SupplyDto } from './supply.type';

export interface EquipmentSupplyUsageDto {
  equipment: EquipmentDto;
  supply: SupplyDto;
  id: number;
  note: string;
  amount: number;
  amountUsed: number;
}

import { UserDto } from './user.type';
import { ServiceDto } from './service.type';

export interface SupplierDto {
  id?: number;
  name?: string;
  address?: string;
  hotline?: string;
  email?: string;
  fax?: string;
  website?: string;
  taxCode?: string;
  contactPersonName?: string;
  contactPersonUsername?: string;
  note?: string;
  serviceNames?: string[];
}

export interface GetSuppliersQueryParam {
  keyword?: string;
  serviceId?: number;
}

export interface SupplierFullInfoDto {
  id?: number;
  name?: string;
  address?: string;
  hotline?: string;
  email?: string;
  fax?: string;
  website?: string;
  taxCode?: string;
  contactPerson?: UserDto;
  note?: string;
  services?: ServiceDto[];
}
export interface UpsertSupplierForm {
  name?: string;
  address?: string;
  hotline?: string;
  email?: string;
  fax?: string;
  website?: string;
  taxCode?: string;
  contactPersonId?: number;
  note?: string;
  serviceIds?: number[];
}

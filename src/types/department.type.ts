import { UserDetailDto, UserDto } from './user.type';

export interface DepartmentDto {
  id: number;
  name: string;
  alias: string;
  phone: string;
  email: string;
  address: string;
  activeStatus: DepartmentActiveStatus;
}

export interface DepartmentFullInfoDto extends DepartmentDto {
  contactPerson: UserDetailDto;
  headOfDepartment: UserDetailDto;
  chiefNurse: UserDetailDto;
  manager: UserDetailDto;
  users: UserDetailDto[];
}

export enum DepartmentActiveStatus {
  ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE',
}

export interface GetDepartmentsQueryParam {
  keyword?: string;
  activeStatus?: DepartmentActiveStatus;
  contactPersonId?: number;
  headOfDepartmentId?: number;
  chiefNurseId?: number;
  managerId?: number;
}

export interface DepartmentListDto extends DepartmentDto {
  contactPerson: UserDto;
  headOfDepartment: UserDto;
  chiefNurse: UserDto;
  manager: UserDto;
}

export interface UpsertDepartmentForm {
  name?: string;
  alias?: string;
  phone?: string;
  email?: string;
  address?: string;
  contactPersonId?: number;
  headOfDepartmentId?: number;
  chiefNurseId?: number;
  managerId?: number;
}

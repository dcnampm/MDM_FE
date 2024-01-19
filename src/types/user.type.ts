import { DepartmentDto } from './department.type';
import { RoleFullInfoDto } from './role.type';
import moment from 'moment';

export interface UserDto { //base User info
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  gender: boolean;
  address: string;
  birthday: string;
  enabled: boolean;
  workingStatus: WorkingStatus;
}

export interface UserDetailDto extends UserDto { //User info with relationship and authorities
  department: DepartmentDto;
  departmentResponsibilities: DepartmentDto[];
  grantedAuthorities: SimpleGrantedAuthority[];
  imageId: number;
  role?: RoleFullInfoDto;
}

export interface SimpleGrantedAuthority {
  authority: string;
}

export interface ChangePasswordForm {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}

export enum WorkingStatus {
  ACTIVE = 'ACTIVE', FORMER = 'FORMER',
}

export interface GetUsersQueryParam {
  keyword?: string;
  gender?: boolean;
  departmentId?: number;
  birthdayQueryStart?: string; // Assuming LocalDate is converted to string
  birthdayQueryEnd?: string; // Assuming java.time.LocalDate is converted to string
  roleIds?: number[];
  roleNames?: string[];
  workingStatus?: WorkingStatus;
  enabled?: boolean;
}

export interface UpsertUserForm {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  gender?: boolean;
  address?: string;
  birthday?: string | moment.Moment;
  enabled?: boolean;
  workingStatus?: WorkingStatus;
  roleId?: number;
  departmentId?: number;
  departmentResponsibilityIds?: number[];
  password?: string;
}

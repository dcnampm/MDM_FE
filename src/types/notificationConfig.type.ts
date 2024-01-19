import { RoleDto } from './role.type';

export interface NotificationConfigFullInfoDto {
  id: number;
  role: RoleDto;
  notificationType: NotificationType;
}

export enum NotificationType {
  HANDOVER = 'HANDOVER',
  TRANSFER = 'TRANSFER',
  REPAIR = 'REPAIR',
  MAINTENANCE = 'MAINTENANCE',
  REPORT_BROKEN = 'REPORT_BROKEN',
  LIQUIDATION = 'LIQUIDATION',
  INSPECTION = 'INSPECTION',
}

export interface UpdateNotificationConfigForm {
  roleId: number;
  notificationType: NotificationType;
}
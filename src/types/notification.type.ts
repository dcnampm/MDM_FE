import { Moment } from 'moment';
import { NotificationType } from './notificationConfig.type';

export interface Notification<T> {
  id: number;
  notificationType: NotificationType;
  content?: string; //json
  createdAt?: Moment;
  equipmentId?: number;

}

export interface EquipmentHistoryDto {
  id: number;
  content?: string; //json
  createdAt?: Moment;
}

export interface GetNotificationsQueryParams {
  isDeleted?: boolean;
  equipmentId?: Number;
  notificationType?: NotificationType;
}
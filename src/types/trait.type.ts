import { TicketStatus } from './reportBroken.type';
import { FileStorageDto } from './fileStorage.type';


/**
 * All others interface that has TicketStatus field should extend this interface
 */
export interface HasTicketStatus{
  status?: TicketStatus;
}
export interface HasAttachments{
  attachments?: FileStorageDto[]
}
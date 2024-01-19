import { Button, Tooltip } from 'antd';
import { fileApi } from '../api/file.api';
import { FileOutlined, FileWordFilled } from '@ant-design/icons';
import { HasAttachments } from '../types/trait.type';
import { downloadDocumentsByListOfFileStorageDtoes } from '../utils/globalFunc.util';
import { FileStorageDto } from '../types/fileStorage.type';

export interface DownloadTicketAttachmentsButtonProps {
  ticket?: HasAttachments;
  downloadButtonTitle?: string;
  isInEquipmentDetail?: boolean;
}

const DownloadTicketAttachmentsButton = (props: DownloadTicketAttachmentsButtonProps) => {

  const { ticket, downloadButtonTitle, isInEquipmentDetail } = props;
  const attachmentsCount = ticket?.attachments?.length as number;
  const ticketHasAttachments = attachmentsCount > 0;
  let tooltipTitle;
  if (attachmentsCount > 0) {
    tooltipTitle =
      `Có ${attachmentsCount} tài liệu: \n${ticket?.attachments?.map(attachment => attachment.name.concat(`.${attachment.extension}`)).join('\n - ')}`;
  } else {
    tooltipTitle = ` Không có tài liệu nào`;
  }
  if (isInEquipmentDetail) {
    return (<div>
      <Tooltip  title={tooltipTitle}>
        <Button style={{ borderWidth: 0 }} disabled={!ticketHasAttachments}>
          <FileOutlined
            onClick={() => {
              fileApi.downloadDocumentByListOfFileStorageDto(ticket?.attachments);
            }} /></Button>
      </Tooltip>
    </div>);
  }
  return (<div>
    <Tooltip
      title={tooltipTitle}
    >
      <Button
        style={{
          marginBottom: '20px', maxWidth: '465px', width: '465px',
        }}
        className={ticketHasAttachments ? 'button' : ''}
        disabled={!ticketHasAttachments}
        onClick={() => {
          fileApi.downloadDocumentByListOfFileStorageDto(ticket?.attachments);
        }} icon={<FileOutlined />}>{downloadButtonTitle ? downloadButtonTitle : ` Tải xuống tất cả tài liệu liên quan`}</Button>
    </Tooltip>
  </div>);
};
export default DownloadTicketAttachmentsButton;
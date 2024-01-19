import { Button, Form, Input, Modal, Upload, UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import { getDateForRendering, getBiggestIdTicket, validateFileSize } from 'utils/globalFunc.util';
import { EquipmentListRepairDto } from '../../types/equipment.type';
import { useTranslation } from 'react-i18next';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import equipmentRepairApi from '../../api/equipment_repair.api';
import { RepairStatus, RepairTicketFullInfoDto } from '../../types/repair.type';
import { ReportBrokenTicketFullInfoDto } from '../../types/reportBroken.type';
import DownloadTicketAttachmentsButton from '../DownloadTicketAttachmentsButton';

interface ModalAcceptanceRepairProps {
  equipment: EquipmentListRepairDto;
  showAcceptanceTestingModal: boolean;
  setShowAcceptanceTestingModal: () => void,
  callback: () => void
}

interface AcceptanceTestingModalForm {
  equipmentId: number;
}

const ModalAcceptanceTesting = (props: ModalAcceptanceRepairProps) => {

  const { t } = useTranslation();
  const {
    equipment, showAcceptanceTestingModal, setShowAcceptanceTestingModal, callback,
  } = props;
  const [acceptanceTestingDocuments, setAcceptanceTestingDocuments] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [repairTicket, setRepairTicket] = useState<RepairTicketFullInfoDto>();
  const [reportBrokenTicket, setReportBrokenTicket] = useState<ReportBrokenTicketFullInfoDto>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (equipment.id == undefined) {
      return;
    }
    form.setFieldsValue({
      status: t(getBiggestIdTicket(equipment.repairTickets)?.repairStatus as string).toString(),
    });
    setAcceptanceTestingDocuments([]);
    setRepairTicket(getBiggestIdTicket(equipment.repairTickets) as RepairTicketFullInfoDto);
    setReportBrokenTicket(getBiggestIdTicket(equipment.reportBrokenTickets) as ReportBrokenTicketFullInfoDto);
  }, [equipment]);
  const uploadProps: UploadProps = {
    name: 'acceptanceTestingDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setAcceptanceTestingDocuments(acceptanceTestingDocuments.concat(info.file));
    }, onRemove: (file) => {
      setAcceptanceTestingDocuments(acceptanceTestingDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: acceptanceTestingDocuments, beforeUpload: validateFileSize,
  };
  const acceptanceTesting = () => {
    equipmentRepairApi.acceptanceTesting(equipment.id as number, repairTicket?.id as number, acceptanceTestingDocuments).then((res) => {
      if (res == undefined) {
        toast.error(`Có lỗi xảy ra khi nghiệm thu thiết bị!`);
        return;
      }
      const status = repairTicket?.repairStatus === RepairStatus.DONE ? 'Đang sử dụng' : 'Ngừng sử dụng';
      toast.success(`Nghiệm thu thành công thiết bị: ${equipment.name}, thiết bị đã được chuyển sang danh sách ${status}!`);
      callback();
    }).catch(() => {
      toast.error(`Có lỗi xảy ra khi nghiệm thu thiết bị!`);
      console.log('Có lỗi xảy ra khi nghiệm thu thiết bị!');
    }).finally(() => {
      setShowAcceptanceTestingModal();
    });
  };
  return (<Modal
    title='Nghiệm thu thiết bị'
    width={1000}
    open={showAcceptanceTestingModal}
    onCancel={setShowAcceptanceTestingModal}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={acceptanceTesting}>
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item name='repairId' className='hidden'>
          <Input className='hidden' />
        </Form.Item>
        <Form.Item
          label=' Tên thiết bị'
        >
          <Input
            disabled value={equipment.name}
          />
        </Form.Item>
        <Form.Item
          label='Khoa phòng'
        >
          <Input
            disabled value={equipment.department?.name}
          />
        </Form.Item>
        <Form.Item
          label=' Mức độ ưu tiên sửa chữa'
        >
          <Input
            disabled value={t(reportBrokenTicket?.priority as string).toString()}
          />
        </Form.Item>
        <Form.Item
          label='Ngày sửa chữa'
        >
          <Input
            disabled value={getDateForRendering(repairTicket?.repairStartDate)}
          />
        </Form.Item>
        <Form.Item
          label=' Ngày kết thúc sửa chữa'
        >
          <Input
            disabled value={getDateForRendering(repairTicket?.repairEndDate)}
          />
        </Form.Item>
        <Form.Item
          label=' Chi phí sửa chữa'
        >
          <Input
            disabled value={repairTicket?.actualCost}
          />
        </Form.Item>
        <Form.Item
          label='Trạng thái sửa chữa'
        >
          <Input
            disabled value={t(repairTicket?.repairStatus as string).toString()}
          />
        </Form.Item>
        <Form.Item label='Tải xuống tài liệu sửa chữa'>
          <DownloadTicketAttachmentsButton ticket={repairTicket} downloadButtonTitle={'Tải xuống tất cả tài liệu sửa chữa của thiết bị này'} />
        </Form.Item>
      </div>
      <Form.Item>
        <Upload {...uploadProps}>
          <Button
            className={'modalFileUploadDownloadButton'} style={{
            width: '950px',
          }} icon={<UploadOutlined />}>Tải lên tài liệu nghiệm thu</Button>
        </Upload>
      </Form.Item>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' loading={loading} className='button'>Xác nhận nghiệm thu sửa chữa thiết bị</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={setShowAcceptanceTestingModal} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};

export default ModalAcceptanceTesting;
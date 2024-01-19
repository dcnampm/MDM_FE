import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { getBiggestIdTicket, getCurrentUser, getDateForRendering } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import TextArea from 'antd/lib/input/TextArea';
import { AcceptMaintenanceTicketModalData } from '../../containers/Equipment/Maintenance';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { AcceptMaintenanceTicketForm, MaintenanceTicketFullInfoDto } from '../../types/maintenance.type';
import equipmentMaintenance from '../../api/equipment_maintenance.api';
import equipment_maintenanceApi from '../../api/equipment_maintenance.api';
import moment from 'moment';
import DownloadTicketAttachmentsButton from '../DownloadTicketAttachmentsButton';

export interface ModalAcceptMaintenanceTicketProps {
  showAcceptMaintenanceTicketModal: boolean;
  hideAcceptMaintenanceTicketModal: () => void;
  callback: () => void;
  acceptMaintenanceTicketModalData: AcceptMaintenanceTicketModalData;
}

const ModalAcceptMaintenanceTicket = (props: ModalAcceptMaintenanceTicketProps) => {
  const {
    showAcceptMaintenanceTicketModal, hideAcceptMaintenanceTicketModal, callback, acceptMaintenanceTicketModalData,
  } = props;
  const { equipment } = acceptMaintenanceTicketModalData;

  const [isAccept, setIsAccept] = useState<boolean>(true);

  const [form] = Form.useForm<AcceptMaintenanceTicketForm>();


  const [maintenanceTicketFullInfoDto, setMaintenanceTicketFullInfoDto] = useState<MaintenanceTicketFullInfoDto>({});


  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    if (equipment?.id === undefined) {
      return;
    }
    setLoading(true);
    form.setFieldsValue({
      approvalDate: moment(new Date()),
    });

    equipment_maintenanceApi.getMaintenanceTicketDetail(equipment?.id as number, getBiggestIdTicket(equipment?.maintenanceTickets)?.id as number)
      .then((res) => {
        setMaintenanceTicketFullInfoDto(res.data.data);
      });
    setLoading(false);
  }, [acceptMaintenanceTicketModalData]);
  const acceptMaintenanceTicket = (acceptMaintenanceTicketForm: AcceptMaintenanceTicketForm) => {
    setLoading(true);
    equipmentMaintenance.acceptMaintenanceTicket(acceptMaintenanceTicketForm, equipment?.id as number, maintenanceTicketFullInfoDto?.id as number)
      .then((res) => {
        if (res.data.success) {
          toast.success('Phê duyệt phiếu đề xuất bảo dưỡng thành công');
          callback();
          hideAcceptMaintenanceTicketModal();
          form.resetFields();
        }
      })
      .catch((err) => {
        toast.error('Lỗi khi phê duyệt phiếu đề xuất bảo dưỡng');
        console.log('Error when accepting maintenance ticket: ', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (<Modal
    title='Phê duyệt phiếu đề xuất bảo dưỡng'
    open={showAcceptMaintenanceTicketModal}
    onCancel={() => {
      hideAcceptMaintenanceTicketModal();
      form.resetFields();
    }}
    footer={null}
    width={1000}
  >

    <Form form={form} layout='vertical' size='large' onFinish={acceptMaintenanceTicket}>
      <div className='grid grid-cols-2 gap-5'>
        <Form.Item label='Tên thiết bị'>
          <Input className='input' disabled value={equipment?.name} />
        </Form.Item>
        <Form.Item label='Khoa Phòng hiện tại'>
          <Input className='input' disabled value={equipment?.department?.name} />
        </Form.Item>

        <Form.Item
          label=' Ngày tạo phiếu'
        >
          <Input className='input' disabled value={getDateForRendering(maintenanceTicketFullInfoDto?.createdDate)} />
        </Form.Item>

        <Form.Item
          label='Người tạo phiếu'
        >
          <Input className='input' disabled value={maintenanceTicketFullInfoDto.creator?.name} />
        </Form.Item>

        <Form.Item
          label='Ghi chú của người tạo phiếu'
        >
          <Input className='input' disabled value={maintenanceTicketFullInfoDto.creatorNote} />
        </Form.Item>
        <Form.Item
          label=' Ngày phê duyệt' name='approvalDate' required
          rules={[{ required: true, message: 'Vui lòng chọn ngày phê duyệt' }]}
        >
          <DatePicker
            style={{
              width: '100%',
            }}
            format={DATE_TIME_FORMAT}
            showTime={{ format: TIME_FORMAT }}
            allowClear={false}
          />
        </Form.Item>
        <Form.Item
          label={isAccept ? 'Ghi chú' : 'Lý do'} name='approverNote'
          required={!isAccept}
          rules={[{ required: !isAccept, message: 'Vui lòng nhập lý do' }]}
        >
          <TextArea placeholder={isAccept ? 'Nhập ghi chú' : 'Nhập lý do'} className='input' />
        </Form.Item>
        <Form.Item label='Người phê duyệt'>
          <Input className='input' disabled value={getCurrentUser().name} />
        </Form.Item>
        <Form.Item label={'Tải xuống tài liệu bảo dưỡng'}>
          <DownloadTicketAttachmentsButton
            ticket={maintenanceTicketFullInfoDto as MaintenanceTicketFullInfoDto}
            downloadButtonTitle={'Tải xuống tất cả tài liệu bảo dưỡng'} />
        </Form.Item>
        <Form.Item
          label='Trạng thái phê duyệt'
          name='isApproved'
          required
          rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
        >
          <Radio.Group
            onChange={(e) => form.setFieldsValue({ isApproved: e.target.value })}
            name='isApproved'>
            <Radio onClick={event => {setIsAccept(true);}} value={true}>Đồng ý</Radio>
            <Radio onClick={event => {setIsAccept(false);}} value={false}>Không đồng ý</Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideAcceptMaintenanceTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);

};
export default ModalAcceptMaintenanceTicket;
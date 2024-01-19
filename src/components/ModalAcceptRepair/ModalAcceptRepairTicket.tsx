import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { formatCurrencyVn, getCurrentUser, getDateForRendering, getBiggestIdTicket } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import { FileOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AcceptRepairTicketModalData } from '../../containers/Equipment/Repair';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { AcceptRepairTicketForm, RepairTicketFullInfoDto } from '../../types/repair.type';
import equipmentRepair from '../../api/equipment_repair.api';
import equipmentRepairApi from '../../api/equipment_repair.api';
import moment from 'moment';
import { fileApi } from '../../api/file.api';
import { FileStorageDto } from '../../types/fileStorage.type';
import i18n from 'i18next';
import DownloadTicketAttachmentsButton from '../DownloadTicketAttachmentsButton';
import { ReportBrokenTicketFullInfoDto } from '../../types/reportBroken.type';

export interface ModalAcceptRepairTicketProps {
  showAcceptRepairTicketModal: boolean;
  hideAcceptRepairTicketModal: () => void;
  callback: () => void;
  acceptRepairTicketModalData: AcceptRepairTicketModalData;
}

const ModalAcceptRepairTicket = (props: ModalAcceptRepairTicketProps) => {
  const {
    showAcceptRepairTicketModal, hideAcceptRepairTicketModal, callback, acceptRepairTicketModalData,
  } = props;
  const { equipment } = acceptRepairTicketModalData;
  const repairTicket = getBiggestIdTicket(equipment?.repairTickets);
  const reportBrokenTicket = getBiggestIdTicket(equipment?.reportBrokenTickets);


  const [isAccept, setIsAccept] = useState<boolean>(true);
  const [form] = Form.useForm<AcceptRepairTicketForm>();


  const [repairTicketFullInfoDto, setRepairTicketFullInfoDto] = useState<RepairTicketFullInfoDto>({});


  const [loading, setLoading] = useState<boolean>();


  useEffect(() => {
    if (equipment?.id === undefined || repairTicket?.id === undefined) {
      return;
    }
    setLoading(true);
    form.setFieldsValue({
      approvalDate: moment(new Date()),
    });
    equipmentRepairApi.getRepairTicketDetail(equipment?.id as number, repairTicket?.id as number).then((res) => {
      if (res.data.success) {
        setRepairTicketFullInfoDto(res.data.data);
      }
    }).catch((err) => {
      toast.error('Lỗi khi lấy thông tin phiếu yêu cầu sửa chữa');
      console.log('Error when getting repair ticket detail: ', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [acceptRepairTicketModalData]);
  const acceptRepairTicket = (acceptRepairTicketForm: AcceptRepairTicketForm) => {
    setLoading(true);
    equipmentRepair.acceptRepairTicket(acceptRepairTicketForm, equipment?.id as number, repairTicket?.id as number).then((res) => {
      if (res.data.success) {
        toast.success('Phê duyệt phiếu yêu cầu sửa chữa thành công');
        callback();
        hideAcceptRepairTicketModal();
        form.resetFields();
      }
    }).catch((err) => {
      toast.error('Lỗi khi phê duyệt phiếu yêu cầu sửa chữa');
      console.log('Error when accepting repair ticket: ', err);
    }).finally(() => {
      setLoading(false);
    });
  };
  return (<Modal
    width={1000}
    title='Phê duyệt phiếu yêu cầu sửa chữa'
    open={showAcceptRepairTicketModal}
    onCancel={() => {
      hideAcceptRepairTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={acceptRepairTicket}>
      <div className='grid grid-cols-2 gap-5'>
        <Form.Item
          label='Tên thiết bị được báo hỏng'
        >
          <Input className='input' defaultValue={equipment?.name} disabled />
        </Form.Item>
        <Form.Item
          label='Khoa Phòng'
        >
          <Input
            disabled className='input' value={equipment?.department?.name}
          />
        </Form.Item>
        <Form.Item
          label='Ngày báo hỏng'
        >
          <Input className='input' disabled value={getDateForRendering(reportBrokenTicket?.createdDate)} />
        </Form.Item>
        <Form.Item label='Lý do hỏng'>
          <Input
            className='input' disabled value={reportBrokenTicket?.reason}
          />
        </Form.Item>
        <DownloadTicketAttachmentsButton ticket={reportBrokenTicket as ReportBrokenTicketFullInfoDto} downloadButtonTitle={'Tải xuống tất cả tài liệu báo hỏng'}/>
        <Form.Item label=' Mức độ ưu tiên'>
          <Input
            className='input' disabled value={i18n.t(reportBrokenTicket?.priority as string).toString()}
          />
        </Form.Item>
      </div>
      <div className='grid grid-cols-2 gap-5'>
        <Form.Item
          label=' Ngày tạo phiếu'
        >
          <Input className='input' disabled value={getDateForRendering(repairTicketFullInfoDto?.createdDate as string)} />
        </Form.Item>
        <Form.Item
          label='Người tạo phiếu'
        >
          <Input className='input' disabled value={repairTicketFullInfoDto.creator?.name} />
        </Form.Item>
        <Form.Item
          label='Ghi chú của người tạo phiếu'
        >
          <Input className='input' disabled value={repairTicketFullInfoDto.creatorNote as string} />
        </Form.Item>
        <Form.Item label='Người phê duyệt'>
          <Input className='input' disabled value={getCurrentUser().name} />
        </Form.Item>
        <Form.Item label=' Giá sửa chữa dự kiến'>
          <Input className='input' disabled value={formatCurrencyVn(repairTicket?.estimatedCost as number)} />
        </Form.Item>
        <Form.Item label=' Công ty sửa chữa'>
          <Input className='input' disabled value={repairTicket?.repairCompany?.name} />
        </Form.Item>
        <Form.Item label={isAccept ? 'Ghi chú' : 'Lý do'} name='approverNote'
        required={!isAccept}
                   rules={[{ required: !isAccept, message: 'Vui lòng nhập lý do' }]}
        >
          <TextArea placeholder={isAccept ? 'Nhập ghi chú' : 'Nhập lý do'} className='input' />
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
        <Form.Item>
          <DownloadTicketAttachmentsButton ticket={repairTicket as RepairTicketFullInfoDto} downloadButtonTitle={'Tải xuống tất cả tài liệu sửa chữa'}/>
        </Form.Item>
        <Form.Item
          label='Trạng thái phê duyệt'
          name='isAccepted'
          required
          rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
        >
          <Radio.Group
            onChange={(e) => form.setFieldsValue({ isAccepted: e.target.value })}
            name='isApproved'>
            <Radio onClick={event => {setIsAccept(true)}} value={true}>Đồng ý</Radio>
            <Radio onClick={event => {setIsAccept(false)}} value={false}>Không đồng ý</Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideAcceptRepairTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);

};
export default ModalAcceptRepairTicket;

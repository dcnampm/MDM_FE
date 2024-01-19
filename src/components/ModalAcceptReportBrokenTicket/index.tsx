import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { getCurrentUser, getDateForRendering, getBiggestIdTicket } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import { FileOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AcceptReportBrokenTicketModalData } from '../../containers/Equipment/ReportBroken';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { fileApi } from '../../api/file.api';
import { FileStorageDto } from '../../types/fileStorage.type';
import { AcceptReportBrokenTicketForm, ReportBrokenTicketFullInfoDto } from '../../types/reportBroken.type';
import { equipmentReportBrokenApi } from '../../api/equipmentReportBrokenApi';
import DownloadTicketAttachmentsButton from '../DownloadTicketAttachmentsButton';

export interface ModalAcceptReportBrokenTicketProps {
  showAcceptReportBrokenTicketModal: boolean;
  hideAcceptReportBrokenTicketModal: () => void;
  callback: () => void;
  acceptReportBrokenTicketModalData: AcceptReportBrokenTicketModalData;
}

const ModalAcceptReportBrokenTicket = (props: ModalAcceptReportBrokenTicketProps) => {
  const {
    showAcceptReportBrokenTicketModal, hideAcceptReportBrokenTicketModal, callback, acceptReportBrokenTicketModalData,
  } = props;
  const { equipment } = acceptReportBrokenTicketModalData;
  const reportBrokenTicket = getBiggestIdTicket(equipment?.reportBrokenTickets);

  const [isAccept, setIsAccept] = useState<boolean>(true);

  const [form] = Form.useForm<AcceptReportBrokenTicketForm>();


  const [reportBrokenTicketFullInfoDto, setReportBrokenTicketFullInfoDto] = useState<ReportBrokenTicketFullInfoDto>({});


  const [loading, setLoading] = useState<boolean>();


  useEffect(() => {
    if (equipment?.id === undefined || reportBrokenTicket?.id === undefined) {
      return;
    }
    setLoading(true);
    form.setFieldsValue({
      approvalDate: moment(new Date()),
    });
    equipmentReportBrokenApi.getReportBrokenTicketDetail(equipment?.id as number, reportBrokenTicket?.id as number).then((res) => {
      if (res.data.success) {
        setReportBrokenTicketFullInfoDto(res.data.data);
      }
    }).catch((err) => {
      toast.error('Lỗi khi lấy thông tin phiếu báo hỏng');
      console.log('Error when getting reportBroken ticket detail: ', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [acceptReportBrokenTicketModalData]);
  const acceptReportBrokenTicket = (acceptReportBrokenTicketForm: AcceptReportBrokenTicketForm) => {
    setLoading(true);
    equipmentReportBrokenApi.acceptReportBrokenTicket(acceptReportBrokenTicketForm, equipment?.id as number, reportBrokenTicket?.id as number).then((res) => {
      if (res.data.success) {
        toast.success('Phê duyệt phiếu báo hỏng thành công');
        callback();
        hideAcceptReportBrokenTicketModal();
        form.resetFields();
      }
    }).catch((err) => {
      toast.error('Lỗi khi phê duyệt phiếu báo hỏng');
      console.log('Error when accepting reportBroken ticket: ', err);
    }).finally(() => {
      setLoading(false);
    });
  };
  return (<Modal
    width={1000}
    title='Phê duyệt phiếu báo hỏng'
    open={showAcceptReportBrokenTicketModal}
    onCancel={() => {
      hideAcceptReportBrokenTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={acceptReportBrokenTicket}>
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item label='Tên thiết bị'>
          <Input className='input' disabled value={equipment?.name} />
        </Form.Item>
        <Form.Item label='Khoa Phòng hiện tại'>
          <Input className='input' disabled value={equipment?.department?.name} />
        </Form.Item>

        <Form.Item
          label=' Ngày báo hỏng'
        >
          <Input className='input' disabled value={getDateForRendering(reportBrokenTicketFullInfoDto?.createdDate as string)} />
        </Form.Item>

        <Form.Item
          label='Người tạo phiếu'
        >
          <Input className='input' disabled value={reportBrokenTicketFullInfoDto.creator?.name} />
        </Form.Item>

        <Form.Item
          label=' Lý do hỏng'
        >
          <Input className='input' disabled value={reportBrokenTicketFullInfoDto.reason as string} />
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
        <Form.Item label={isAccept ? 'Ghi chú' : 'Lý do'} name='approverNote'
        required={!isAccept}
                   rules={[{ required: !isAccept, message: 'Vui lòng nhập lý do' }]}
        >
          <TextArea placeholder={isAccept ? 'Nhập ghi chú' : 'Nhập lý do'} className='input' />
        </Form.Item>
        <Form.Item label='Người phê duyệt'>
          <Input className='input' disabled value={getCurrentUser().name} />
        </Form.Item>
        <Form.Item label={'Tải xuống tài liệu báo hỏng'}>
          <DownloadTicketAttachmentsButton ticket={reportBrokenTicket as ReportBrokenTicketFullInfoDto}/>
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
          <Button onClick={() => hideAcceptReportBrokenTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);

};
export default ModalAcceptReportBrokenTicket;

import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { getCurrentUser, getDateForRendering, getBiggestIdTicket } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import { FileOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AcceptInspectionTicketModalData } from '../../containers/Equipment/Inspection';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { fileApi } from '../../api/file.api';
import { AcceptInspectionTicketForm, InspectionTicketFullInfoDto } from '../../types/equipmentInspection.type';
import equipmentInspectionApi from '../../api/equipmentInspection.api';
import DownloadTicketAttachmentsButton from '../DownloadTicketAttachmentsButton';

export interface ModalAcceptInspectionTicketProps {
  showAcceptInspectionTicketModal: boolean;
  hideAcceptInspectionTicketModal: () => void;
  callback: () => void;
  acceptInspectionTicketModalData: AcceptInspectionTicketModalData;
}

const ModalAcceptInspectionTicket = (props: ModalAcceptInspectionTicketProps) => {
  const {
    showAcceptInspectionTicketModal, hideAcceptInspectionTicketModal, callback, acceptInspectionTicketModalData,
  } = props;
  const { equipment } = acceptInspectionTicketModalData;
  const inspectionTicket = getBiggestIdTicket(equipment?.inspectionTickets);


  const [form] = Form.useForm<AcceptInspectionTicketForm>();

  const [isAccept, setIsAccept] = useState<boolean>(true);

  const [inspectionTicketFullInfoDto, setInspectionTicketFullInfoDto] = useState<InspectionTicketFullInfoDto>({});


  const [loading, setLoading] = useState<boolean>();


  useEffect(() => {
    if (equipment?.id === undefined || inspectionTicket?.id === undefined) {
      return;
    }
    setLoading(true);
    form.setFieldsValue({
      approvalDate: moment(new Date()),
    });
    setIsAccept(true);
    equipmentInspectionApi.getInspectionTicketDetail(equipment?.id as number, inspectionTicket?.id as number).then((res) => {
      if (res.data.success) {
        setInspectionTicketFullInfoDto(res.data.data);
      }
    }).catch((err) => {
      toast.error('Lỗi khi lấy thông tin phiếu đề xuất kiểm định');
      console.log('Error when getting inspection ticket detail: ', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [acceptInspectionTicketModalData]);
  const acceptInspectionTicket = (acceptInspectionTicketForm: AcceptInspectionTicketForm) => {
    setLoading(true);
    equipmentInspectionApi.acceptInspectionTicket(acceptInspectionTicketForm, equipment?.id as number, inspectionTicket?.id as number).then((res) => {
      if (res.data.success) {
        toast.success('Phê duyệt phiếu đề xuất kiểm định thành công');
        callback();
        hideAcceptInspectionTicketModal();
        form.resetFields();
      }
    }).catch((err) => {
      toast.error('Lỗi khi phê duyệt phiếu đề xuất kiểm định');
      console.log('Error when accepting inspection ticket: ', err);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (<Modal
    width={1000}
    title='Phê duyệt phiếu đề xuất kiểm định'
    open={showAcceptInspectionTicketModal}
    onCancel={() => {
      hideAcceptInspectionTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={acceptInspectionTicket}>
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
          <Input className='input' disabled value={getDateForRendering(inspectionTicketFullInfoDto?.createdDate)} />
        </Form.Item>

        <Form.Item
          label='Người tạo phiếu'
        >
          <Input className='input' disabled value={inspectionTicketFullInfoDto.creator?.name} />
        </Form.Item>

        <Form.Item
          label='Ghi chú của người tạo phiếu'
        >
          <Input className='input' disabled value={inspectionTicketFullInfoDto.creatorNote} />
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
        <Form.Item label={'Tải xuống tài liệu kiểm định'}>
          <DownloadTicketAttachmentsButton ticket={inspectionTicket as InspectionTicketFullInfoDto} downloadButtonTitle={'Tải xuống tài liệu kiểm định'} />
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
          <Button onClick={() => hideAcceptInspectionTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);

};
export default ModalAcceptInspectionTicket;

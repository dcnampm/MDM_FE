import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { getCurrentUser, getDateForRendering, getBiggestIdTicket } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import { FileOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AcceptHandoverTicketModalData } from '../../containers/Equipment/Handover';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { AcceptHandoverTicketForm, HandoverTicketFullInfoDto } from '../../types/handover.type';
import equipmentHandover from '../../api/equipment_handover.api';
import equipmentHandoverApi from '../../api/equipment_handover.api';
import moment from 'moment';
import { fileApi } from '../../api/file.api';
import { FileStorageDto } from '../../types/fileStorage.type';
import DownloadTicketAttachmentsButton from '../DownloadTicketAttachmentsButton';

export interface ModalAcceptHandoverTicketProps {
  showAcceptHandoverTicketModal: boolean;
  hideAcceptHandoverTicketModal: () => void;
  callback: () => void;
  acceptHandoverTicketModalData: AcceptHandoverTicketModalData;
}

const ModalAcceptHandoverTicket = (props: ModalAcceptHandoverTicketProps) => {
  const {
    showAcceptHandoverTicketModal, hideAcceptHandoverTicketModal, callback, acceptHandoverTicketModalData,
  } = props;
  const { equipment } = acceptHandoverTicketModalData;
  const handoverTicket= getBiggestIdTicket(equipment?.handoverTickets);


  const [form] = Form.useForm<AcceptHandoverTicketForm>();


  const [handoverTicketFullInfoDto, setHandoverTicketFullInfoDto] = useState<HandoverTicketFullInfoDto>({});


  const [loading, setLoading] = useState<boolean>();

  const [isAccept, setIsAccept] = useState<boolean>(true);

  useEffect(() => {
    if (equipment?.id === undefined || handoverTicket?.id === undefined) {
      return;
    }
    setLoading(true);
    form.setFieldsValue({
      approvalDate: moment(new Date()),
    });
    equipmentHandoverApi.getHandoverTicketDetail(equipment?.id as number, handoverTicket?.id as number).then((res) => {
      if (res.data.success) {
        setHandoverTicketFullInfoDto(res.data.data);
      }
    }).catch((err) => {
      toast.error('Lỗi khi lấy thông tin phiếu yêu cầu bàn giao');
      console.log('Error when getting handover ticket detail: ', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [acceptHandoverTicketModalData]);
  const acceptHandoverTicket = (acceptHandoverTicketForm: AcceptHandoverTicketForm) => {
    setLoading(true);
    equipmentHandover.acceptHandoverTicket(acceptHandoverTicketForm, equipment?.id as number, handoverTicket?.id as number).then((res) => {
      if (res.data.success) {
        toast.success('Phê duyệt phiếu yêu cầu bàn giao thành công');
        callback();
        hideAcceptHandoverTicketModal();
        form.resetFields();
      }
    }).catch((err) => {
      toast.error('Lỗi khi phê duyệt phiếu yêu cầu bàn giao');
      console.log('Error when accepting handover ticket: ', err);
    }).finally(() => {
      setLoading(false);
    });
  };
  return (<Modal
    width={1000}
    title='Phê duyệt phiếu yêu cầu bàn giao'
    open={showAcceptHandoverTicketModal}
    onCancel={() => {
      hideAcceptHandoverTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={acceptHandoverTicket}>
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
          <Input className='input' disabled value={getDateForRendering(handoverTicketFullInfoDto?.createdDate as string)} />
        </Form.Item>

        <Form.Item
          label='Người tạo phiếu'
        >
          <Input className='input' disabled value={handoverTicketFullInfoDto.creator?.name} />
        </Form.Item>

        <Form.Item
          label='Ghi chú của người tạo phiếu'
        >
          <TextArea rows={2} className='input' disabled value={handoverTicketFullInfoDto.creatorNote as string} />
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
        <Form.Item label={'Tải xuống tài liệu bàn giao'}>
          <DownloadTicketAttachmentsButton ticket={handoverTicket as HandoverTicketFullInfoDto}/>
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
          <Button onClick={() => hideAcceptHandoverTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);

};
export default ModalAcceptHandoverTicket;

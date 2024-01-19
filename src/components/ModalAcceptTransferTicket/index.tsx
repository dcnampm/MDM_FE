import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import equipmentTransferApi from 'api/equipment_transfer.api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AcceptTransferTicketModalData } from '../../containers/Equipment/Transfer';
import { AcceptTransferTicketForm, TransferTicketFullInfoDto } from '../../types/transfer.type';
import moment from 'moment';
import { getCurrentUser, getBiggestIdTicket } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import TextArea from 'antd/lib/input/TextArea';
import { fileApi } from '../../api/file.api';
import { FileOutlined } from '@ant-design/icons';
import DownloadTicketAttachmentsButton from '../DownloadTicketAttachmentsButton';


export interface ModalAcceptTransferTicketProps {
  showAcceptTransferTicketModal: boolean;
  hideAcceptTransferTicketModal: () => void;
  callback: () => void;
  acceptTransferTicketModalData: AcceptTransferTicketModalData;
}


const ModalAcceptTransferTicket = (props: ModalAcceptTransferTicketProps) => {

  const {
     showAcceptTransferTicketModal,  hideAcceptTransferTicketModal, acceptTransferTicketModalData, callback,
  } = props;
  const transferTicket = getBiggestIdTicket(acceptTransferTicketModalData.equipment?.transferTickets);
  const [form] = Form.useForm<AcceptTransferTicketForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAccept, setIsAccept] = useState<boolean>(true);
  useEffect(() => {
    if (Object.keys(acceptTransferTicketModalData).length === 0) return;
    form.setFieldsValue({
      approvalDate: moment(new Date()),
    });
  }, [acceptTransferTicketModalData]);

  const handleApproverTransfer = (values: AcceptTransferTicketForm) => {
    setLoading(true);
    equipmentTransferApi.acceptTransferTicket(acceptTransferTicketModalData.equipment?.id as number, transferTicket?.id as number, values)
      .then(value => {
        if (value?.data?.success) {
          toast.success('Phê duyệt thành công');
          hideAcceptTransferTicketModal();
          callback();
        } else {
          console.log('error when accept transfer ticket: ', value);
        }
      }, reason => {
        toast.error('Phê duyệt thất bại');
        console.log('error when accept transfer ticket reason: ', reason);
      }).catch(reason => {
      toast.error('Phê duyệt thất bại');
      console.log('error when accept transfer ticket: ', reason);
    }).finally(() => setLoading(false));
  };

  return (<Modal width={1000}
    title='Phê duyệt yêu cầu điều chuyển thiết bị'
    open={showAcceptTransferTicketModal}
    onCancel={() => {
      hideAcceptTransferTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form
      form={form}
      layout='vertical'
      size='large'
      onFinish={handleApproverTransfer}
    >
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item style={{ display: 'none' }}></Form.Item>
        <Form.Item label='Tên thiết bị'>
          <Input className='input' disabled value={acceptTransferTicketModalData.equipment?.name as string} />
        </Form.Item>
        <Form.Item label='Khoa phòng hiện tại'>
          <Input className='input' disabled value={transferTicket?.fromDepartment?.name as string} />
        </Form.Item>
        <Form.Item label='Khoa phòng điều chuyển'>
          <Input className='input' disabled value={transferTicket?.toDepartment?.name as string} />
        </Form.Item>
        <Form.Item label=' Ngày thực hiện điều chuyển '>
          <Input className='input' disabled value={moment(transferTicket?.dateTransfer).format(DATE_TIME_FORMAT)} />
        </Form.Item>
        <Form.Item label='Người tạo phiếu'>
          <Input className='input' disabled value={transferTicket?.creator?.name as string} />
        </Form.Item>
        <Form.Item label=' Ngày tạo phiếu'>
          <Input className='input' disabled value={moment(transferTicket?.createdDate).format(DATE_TIME_FORMAT)} />
        </Form.Item>
        <Form.Item label='Ghi chú điều chuyển'>
          <Input className='input' disabled value={transferTicket?.transferNote} />
        </Form.Item>
        <Form.Item label='Người phê duyệt'>
          <Input disabled className='input' value={getCurrentUser().name as string} />
        </Form.Item>
        <Form.Item
          label='Ngày phê duyệt'
          className='mb-5'
          name='approvalDate'
          required
          rules={[{ required: true, message: 'Hãy chọn ngày phê duyệt' }]}
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
        <Form.Item label={'Tải xuống tài liệu điều chuyển'}>
          <DownloadTicketAttachmentsButton ticket={transferTicket as TransferTicketFullInfoDto}/>
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
            <Radio onClick={() => {setIsAccept(true)}} value={true}>Đồng ý</Radio>
            <Radio onClick={() => {setIsAccept(false)}} value={false}>Không đồng ý</Radio>
          </Radio.Group>
        </Form.Item>

      </div>
      <div className='flex flex-row justify-end gap-4'>

        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={hideAcceptTransferTicketModal} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};

export default ModalAcceptTransferTicket;
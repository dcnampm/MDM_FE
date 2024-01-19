import { Button, DatePicker, Form, Input, Modal, Radio } from 'antd';
import { getCurrentUser, getDateForRendering, getBiggestIdTicket } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import { FileOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AcceptLiquidationTicketModalData } from '../../containers/Equipment/Liquidation';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { fileApi } from '../../api/file.api';
import { AcceptLiquidationTicketForm, LiquidationTicketFullInfoDto } from '../../types/equipmentLiquidation.type';
import equipmentLiquidationApi from '../../api/equipment_liquidation.api';
import DownloadTicketAttachmentsButton from '../DownloadTicketAttachmentsButton';

export interface ModalAcceptLiquidationTicketProps {
  showAcceptLiquidationTicketModal: boolean;
  hideAcceptLiquidationTicketModal: () => void;
  callback: () => void;
  acceptLiquidationTicketModalData: AcceptLiquidationTicketModalData;
}

const ModalAcceptLiquidationTicket = (props: ModalAcceptLiquidationTicketProps) => {
  const {
    showAcceptLiquidationTicketModal, hideAcceptLiquidationTicketModal, callback, acceptLiquidationTicketModalData,
  } = props;
  const { equipment } = acceptLiquidationTicketModalData;
  const liquidationTicket = getBiggestIdTicket(equipment?.liquidationTickets);

  const [isAccept, setIsAccept] = useState<boolean>(true);

  const [form] = Form.useForm<AcceptLiquidationTicketForm>();


  const [liquidationTicketFullInfoDto, setLiquidationTicketFullInfoDto] = useState<LiquidationTicketFullInfoDto>({});


  const [loading, setLoading] = useState<boolean>();


  useEffect(() => {
    if (equipment?.id === undefined || liquidationTicket?.id === undefined) {
      return;
    }
    setLoading(true);
    form.setFieldsValue({
      approvalDate: moment(new Date()),
    });
    equipmentLiquidationApi.getLiquidationTicketDetail(equipment?.id as number, liquidationTicket?.id as number).then((res) => {
      if (res.data.success) {
        setLiquidationTicketFullInfoDto(res.data.data);
      }
    }).catch((err) => {
      toast.error('Lỗi khi lấy thông tin phiếu đề xuất thanh lý');
      console.log('Error when getting liquidation ticket detail: ', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [acceptLiquidationTicketModalData]);
  const acceptLiquidationTicket = (acceptLiquidationTicketForm: AcceptLiquidationTicketForm) => {
    setLoading(true);
    equipmentLiquidationApi.acceptLiquidationTicket(acceptLiquidationTicketForm, equipment?.id as number, liquidationTicket?.id as number).then((res) => {
      if (res.data.success) {
        toast.success('Phê duyệt phiếu đề xuất thanh lý thành công');
        callback();
        hideAcceptLiquidationTicketModal();
        form.resetFields();
      }
    }).catch((err) => {
      toast.error('Lỗi khi phê duyệt phiếu đề xuất thanh lý');
      console.log('Error when accepting liquidation ticket: ', err);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (<Modal
    width={1000}
    title='Phê duyệt phiếu đề xuất thanh lý'
    open={showAcceptLiquidationTicketModal}
    onCancel={() => {
      hideAcceptLiquidationTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={acceptLiquidationTicket}>
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
          <Input className='input' disabled value={getDateForRendering(liquidationTicketFullInfoDto?.createdDate)} />
        </Form.Item>

        <Form.Item
          label='Người tạo phiếu'
        >
          <Input className='input' disabled value={liquidationTicketFullInfoDto.creator?.name} />
        </Form.Item>

        <Form.Item
          label='Ghi chú của người tạo phiếu'
        >
          <Input className='input' disabled value={liquidationTicketFullInfoDto.creatorNote} />
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
        <Form.Item label={'Tải xuống tài liệu thanh lý'}>
          <DownloadTicketAttachmentsButton ticket={liquidationTicket as LiquidationTicketFullInfoDto}  downloadButtonTitle={'Tải xuống tài liệu thanh lý'} />
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
          <Button onClick={() => hideAcceptLiquidationTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);

};
export default ModalAcceptLiquidationTicket;

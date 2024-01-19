import { Button, DatePicker, Form, Input, Modal, Radio, Upload, UploadProps } from 'antd';
import { getCurrentUser, validateFileSize } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import { CreateReportBrokenTicketForm } from '../../types/reportBroken.type';
import { toast } from 'react-toastify';
import moment from 'moment';
import { CreateReportBrokenTicketModalData } from '../../containers/Equipment/ReportBroken';
import { equipmentReportBrokenApi } from '../../api/equipmentReportBrokenApi';
import { RepairPriority } from '../../types/repair.type';

export interface ModalCreateReportBrokenTicketProps {
  showCreateReportBrokenTicketModal: boolean;
  hideCreateReportBrokenTicketModal: () => void;
  callback: () => void;
  createReportBrokenTicketModalData: CreateReportBrokenTicketModalData;
}


export const ModalCreateReportBrokenTicket = (props: ModalCreateReportBrokenTicketProps) => {
  const {
    showCreateReportBrokenTicketModal, hideCreateReportBrokenTicketModal, callback, createReportBrokenTicketModalData,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<CreateReportBrokenTicketForm>();
  const [createReportBrokenTicketDocuments, setCreateReportBrokenTicketDocuments] = useState<any[]>([]);
  const initializeForm = () => {
    form.resetFields();
    form.setFieldsValue({
      createdDate: moment(new Date()),
    });
    setCreateReportBrokenTicketDocuments([]);
  };
  useEffect(() => {
    initializeForm();
  }, [createReportBrokenTicketModalData]);

  const uploadProps: UploadProps = {
    name: 'createReportBrokenTicketDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setCreateReportBrokenTicketDocuments(createReportBrokenTicketDocuments.concat(info.file));
    }, onRemove: (file) => {
      setCreateReportBrokenTicketDocuments(createReportBrokenTicketDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: createReportBrokenTicketDocuments, beforeUpload: validateFileSize,
  };
  const createReportBrokenTicket = (values: CreateReportBrokenTicketForm) => {
    setLoading(true);
    equipmentReportBrokenApi.createReportBrokenTicket(values, createReportBrokenTicketModalData.equipment?.id as number, createReportBrokenTicketDocuments)
      .then((res) => {
        if (res.data.success) {
          toast.success('Tạo phiếu yêu cầu báo hỏng thành công');
          callback();
          hideCreateReportBrokenTicketModal();
        }
      })
      .catch((err) => {
        toast.error('Tạo phiếu yêu cầu báo hỏng thất bại');
        console.log('🚀 ~ file: index.tsx ~ createReportBrokenTicket ~ err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (<Modal
    width={1000}
    title='Báo hỏng thiết bị'
    open={showCreateReportBrokenTicketModal}
    onCancel={() => {
      hideCreateReportBrokenTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createReportBrokenTicket}>
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item label='Tên thiết bị'>
          <Input className='input' disabled value={createReportBrokenTicketModalData.equipment?.name} />
        </Form.Item>

        <Form.Item label='Khoa phòng'>
          <Input className='input' disabled value={createReportBrokenTicketModalData.equipment?.department?.name} />
        </Form.Item>
        <Form.Item
          label='Ngày tạo phiếu' name='createdDate' required
          rules={[{ required: true, message: 'Vui lòng chọn ngày tạo phiếu' }]}
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
          label=' Lý do hỏng' name='reason'
          required
          rules={[{ required: true, message: 'Hãy nhập lý do hỏng!' }]}
        >
          <TextArea placeholder='Nhập lý do hỏng' className='input' />
        </Form.Item>
        <Form.Item label='Người lập phiếu yêu cầu'>
          <Input className='input' disabled value={getCurrentUser().name} />
        </Form.Item>
        <Form.Item
          label='Mức độ quan trọng'
          name='priority'
          required
          rules={[{ required: true, message: 'Hãy chọn mức độ quan trọng!' }]}
        >
          <Radio.Group>
            <Radio value={RepairPriority.HIGH}>Cao</Radio>
            <Radio value={RepairPriority.MEDIUM}>Trung bình</Radio>
            <Radio value={RepairPriority.LOW}>Thấp</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={'Tải lên tài liệu báo hỏng'}>
          <Upload {...uploadProps}  >
            <Button className='modalFileUploadDownloadButton' icon={<UploadOutlined />}> Tải lên tài liệu báo hỏng</Button>
          </Upload>
        </Form.Item>


      </div>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateReportBrokenTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};

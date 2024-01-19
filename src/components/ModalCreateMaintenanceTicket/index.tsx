import { Button, DatePicker, Form, Input, Modal, Upload, UploadProps } from 'antd';
import { getCurrentUser, validateFileSize } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import { CreateMaintenanceTicketForm } from '../../types/maintenance.type';
import equipmentMaintenance from '../../api/equipment_maintenance.api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { CreateMaintenanceTicketModalData } from '../../containers/Equipment/Maintenance';

export interface ModalCreateMaintenanceTicketProps {
  showCreateMaintenanceTicketModal: boolean;
  hideCreateMaintenanceTicketModal: () => void;
  callback: () => void;
  createMaintenanceTicketModalData: CreateMaintenanceTicketModalData;
}


export const ModalCreateMaintenanceTicket = (props: ModalCreateMaintenanceTicketProps) => {
  const {
    showCreateMaintenanceTicketModal, hideCreateMaintenanceTicketModal, callback, createMaintenanceTicketModalData,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<CreateMaintenanceTicketForm>();
  const [createMaintenanceTicketDocuments, setCreateMaintenanceTicketDocuments] = useState<any[]>([]);
  const initializeForm = () => {
    form.resetFields();
    form.setFieldsValue({
      createdDate: moment(new Date()),
    });
    setCreateMaintenanceTicketDocuments([]);
  };
  useEffect(() => {
    initializeForm();
  }, [createMaintenanceTicketModalData]);

  const uploadProps: UploadProps = {
    name: 'createMaintenanceTicketDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setCreateMaintenanceTicketDocuments(createMaintenanceTicketDocuments.concat(info.file));
    }, onRemove: (file) => {
      setCreateMaintenanceTicketDocuments(createMaintenanceTicketDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: createMaintenanceTicketDocuments, beforeUpload: validateFileSize,
  };
  const createMaintenanceTicket = (values: CreateMaintenanceTicketForm) => {
    setLoading(true);
    equipmentMaintenance.createMaintenanceTicket(values, createMaintenanceTicketModalData.equipment?.id as number, createMaintenanceTicketDocuments)
      .then((res) => {
        if (res.data.success) {
          toast.success('Tạo phiếu đề xuất bảo dưỡng thành công');
          callback();
          hideCreateMaintenanceTicketModal();
        }
      })
      .catch((err) => {
        toast.error('Tạo phiếu đề xuất bảo dưỡng thất bại');
        console.log('🚀 ~ file: index.tsx ~ createMaintenanceTicket ~ err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (<Modal
    title='Đề xuất bảo dưỡng thiết bị'
    open={showCreateMaintenanceTicketModal}
    onCancel={() => {
      hideCreateMaintenanceTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createMaintenanceTicket}>
      <Form.Item label='Tên thiết bị'>
        <Input className='input' disabled value={createMaintenanceTicketModalData.equipment?.name} />
      </Form.Item>
      <Form.Item label='Khoa Phòng hiện tại'>
        <Input className='input' disabled value={createMaintenanceTicketModalData.equipment?.department?.name} />
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
      <Form.Item label='Ghi chú' name='creatorNote'>
        <TextArea placeholder='Nhập ghi chú' className='input' />
      </Form.Item>
      <Form.Item label='Người lập phiếu đề xuất'>
        <Input className='input' disabled value={getCurrentUser().name} />
      </Form.Item>
      <Form.Item label={'Tải lên tài liệu bảo dưỡng'}>
        <Upload {...uploadProps}  >
          <Button className='modalFileUploadDownloadButton' icon={<UploadOutlined />}> Tải lên tài liệu bảo dưỡng</Button>
        </Upload>
      </Form.Item>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateMaintenanceTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};
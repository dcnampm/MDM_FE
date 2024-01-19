import { CreateInspectionTicketModalData } from '../../containers/Equipment/Inspection';
import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Upload, UploadProps } from 'antd';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { getCurrentUser, validateFileSize } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import TextArea from 'antd/lib/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';
import { CreateInspectionTicketForm } from '../../types/equipmentInspection.type';
import equipmentInspectionApi from '../../api/equipmentInspection.api';

export interface ModalCreateInspectionTicketProps {
  showCreateInspectionTicketModal: boolean;
  hideCreateInspectionTicketModal: () => void;
  callback: () => void;
  createInspectionTicketModalData: CreateInspectionTicketModalData;
}


export const ModalCreateInspectionTicket = (props: ModalCreateInspectionTicketProps) => {
  const {
    showCreateInspectionTicketModal, hideCreateInspectionTicketModal, callback, createInspectionTicketModalData,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<CreateInspectionTicketForm>();
  const [createInspectionTicketDocuments, setCreateInspectionTicketDocuments] = useState<any[]>([]);
  const initializeForm = () => {
    resetForm();
    form.setFieldsValue({
      createdDate: moment(new Date()),
    });
  };
  useEffect(() => {
    initializeForm();
  }, [createInspectionTicketModalData]);
  const resetForm = () => {
    form.resetFields();
    setCreateInspectionTicketDocuments([]);
  };
  const uploadProps: UploadProps = {
    name: 'createInspectionTicketDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setCreateInspectionTicketDocuments(createInspectionTicketDocuments.concat(info.file));
    }, onRemove: (file) => {
      setCreateInspectionTicketDocuments(createInspectionTicketDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: createInspectionTicketDocuments, beforeUpload: validateFileSize,
  };
  const createInspectionTicket = (values: CreateInspectionTicketForm) => {
    setLoading(true);
    equipmentInspectionApi.createInspectionTicket(values, createInspectionTicketModalData.equipment?.id as number, createInspectionTicketDocuments).then((res) => {
      if (res.data.success) {
        toast.success('Tạo phiếu đề xuất kiểm định thành công');
        callback();
        hideCreateInspectionTicketModal();
      }
    }).finally(() => {
      setLoading(false);
    });
  };
  return (<Modal
    title='Đề xuất kiểm định thiết bị'
    open={showCreateInspectionTicketModal}
    onCancel={() => {
      hideCreateInspectionTicketModal();
      resetForm();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createInspectionTicket}>
      <Form.Item label='Tên thiết bị'>
        <Input className='input' disabled value={createInspectionTicketModalData.equipment?.name} />
      </Form.Item>
      <Form.Item label='Khoa Phòng hiện tại'>
        <Input className='input' disabled value={createInspectionTicketModalData.equipment?.department?.name} />
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
      <Form.Item label={'Tải lên tài liệu kiểm định'}>
        <Upload {...uploadProps}  >
          <Button className='modalFileUploadDownloadButton' icon={<UploadOutlined />}> Tải lên tài liệu kiểm định</Button>
        </Upload>
      </Form.Item>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateInspectionTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};

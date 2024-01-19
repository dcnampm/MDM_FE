import { Button, DatePicker, Form, Input, Modal, Select, Upload, UploadProps } from 'antd';
import equipmentTransferApi from 'api/equipment_transfer.api';
import { FilterContext } from 'contexts/filter.context';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCurrentUser, getDepartmentOptionsForCreateTransferTicket, showListOfErrors, validateFileSize } from 'utils/globalFunc.util';
import { EquipmentListDto } from '../../types/equipment.type';
import { CreateTransferTicketForm } from '../../types/transfer.type';
import { UploadOutlined } from '@ant-design/icons';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import moment from 'moment';
import { CreateTransferTicketModalData } from '../../containers/Equipment/Transfer';
import { DepartmentDto } from '../../types/department.type';

export interface DataTransfer {
  equipment?: EquipmentListDto;
}

export interface ModalCreateTransferProps {
  showCreateTransferTicketModal: boolean;
  hideCreateTransferTicketModal: () => void;
  callback: () => void;
  createTransferTicketModalData: CreateTransferTicketModalData;
}

const ModalCreateTransferTicket = (props: ModalCreateTransferProps) => {

  const {
    showCreateTransferTicketModal, hideCreateTransferTicketModal, callback, createTransferTicketModalData,
  } = props;

  const { TextArea } = Input;
  const { departments } = useContext(FilterContext);
  const [form] = Form.useForm<CreateTransferTicketForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const [createTransferTicketDocuments, setCreateTransferTicketDocuments] = useState<any[]>([]);
  const uploadProps: UploadProps = {
    name: 'createTransferTicketDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setCreateTransferTicketDocuments(createTransferTicketDocuments.concat(info.file));
    }, onRemove: (file) => {
      setCreateTransferTicketDocuments(createTransferTicketDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: createTransferTicketDocuments, beforeUpload: validateFileSize,
  };
  useEffect(() => {
    if (Object.keys(createTransferTicketModalData).length === 0) return;
    form.setFieldsValue({ dateTransfer: moment(new Date()), createdDate: moment(new Date()) });
    setCreateTransferTicketDocuments([]);
  }, [createTransferTicketModalData]);

  const createTransferTicket = (values: CreateTransferTicketForm) => {
    setLoading(true);
    equipmentTransferApi.createTransferTicket(createTransferTicketModalData.equipment?.id as number, values, createTransferTicketDocuments).then((res) => {
      if (res.data.success) {
        toast.success('Tạo phiếu điều chuyển thiết bị thành công!');
        callback();
      } else {
        toast.error('Tạo phiếu điều chuyển thất bại');
        showListOfErrors(res.data.errors as string[]);
      }
    }).catch((reason) => {
      toast.error('Tạo phiếu điều chuyển thất bại');
      console.log(reason);
    }).finally(() => {
      setLoading(false);
      hideCreateTransferTicketModal();
      form.resetFields();
    });
  };

  return (<Modal
    width={1000}
    title='Điều chuyển thiết bị'
    open={showCreateTransferTicketModal}
    onCancel={() => {
      hideCreateTransferTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createTransferTicket}>
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item label='Tên thiết bị'>
          <Input className='input' disabled value={createTransferTicketModalData.equipment?.name} />
        </Form.Item>
        <Form.Item label='Khoa Phòng hiện tại'>
          <Input className='input' disabled value={createTransferTicketModalData.equipment?.department?.name} />
        </Form.Item>
        <Form.Item
          label='Khoa Phòng điều chuyển' name='toDepartmentId' required
          rules={[{ required: true, message: 'Hãy chọn khoa phòng điều chuyển!' }]}
        >
          <Select
            placeholder='Chọn Khoa phòng'
            options={getDepartmentOptionsForCreateTransferTicket(departments, createTransferTicketModalData.equipment?.department as DepartmentDto)} />
        </Form.Item>
        <Form.Item label='Ngày tạo phiếu' name='createdDate' required>
          <DatePicker
            style={{
              width: '100%',
            }}
            format={DATE_TIME_FORMAT}
            showTime={{ format: TIME_FORMAT }}
            allowClear={false}
          />
        </Form.Item>
        <Form.Item label='Ngày Điều chuyển' name='dateTransfer' required>
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
        <Form.Item label='Người lập biên bản'>
          <Input className='input' disabled value={getCurrentUser().name} />
        </Form.Item>
        <Form.Item label={'Tải lên tài liệu điều chuyển'}>
          <Upload {...uploadProps} >
            <Button className='modalFileUploadDownloadButton' icon={<UploadOutlined />}> Tải lên tài liệu điều chuyển</Button>
          </Upload>
        </Form.Item>

      </div>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateTransferTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};

export default ModalCreateTransferTicket;
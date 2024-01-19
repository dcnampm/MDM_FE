import { Button, DatePicker, Form, Input, Modal, Select, Upload, UploadProps } from 'antd';
import { getCurrentUser, getDepartmentOptions, options, validateFileSize } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { useContext, useEffect, useState } from 'react';
import { CreateHandoverTicketForm } from '../../types/handover.type';
import equipmentHandover from '../../api/equipment_handover.api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { CreateHandoverTicketModalData } from '../../containers/Equipment/Handover';
import { FilterContext } from '../../contexts/filter.context';
import userApi from '../../api/user.api';
import { UserDetailDto } from '../../types/user.type';

export interface ModalCreateHandoverTicketProps {
  showCreateHandoverTicketModal: boolean;
  hideCreateHandoverTicketModal: () => void;
  callback: () => void;
  createHandoverTicketModalData: CreateHandoverTicketModalData;
}


export const ModalCreateHandoverTicket = (props: ModalCreateHandoverTicketProps) => {
  const {
    showCreateHandoverTicketModal, hideCreateHandoverTicketModal, callback, createHandoverTicketModalData,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<CreateHandoverTicketForm>();
  const [createHandoverTicketDocuments, setCreateHandoverTicketDocuments] = useState<any[]>([]);
  const { departments } = useContext(FilterContext);
  const [responsiblePersons, setResponsiblePersons] = useState<UserDetailDto[]>([]);
  const initializeForm = () => {
    form.resetFields();
    form.setFieldsValue({
      createdDate: moment(new Date()),
    });
    setCreateHandoverTicketDocuments([]);
  };
  useEffect(() => {
    initializeForm();
  }, [createHandoverTicketModalData]);

  const uploadProps: UploadProps = {
    name: 'createHandoverTicketDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setCreateHandoverTicketDocuments(createHandoverTicketDocuments.concat(info.file));
    }, onRemove: (file) => {
      setCreateHandoverTicketDocuments(createHandoverTicketDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: createHandoverTicketDocuments, beforeUpload: validateFileSize,
  };
  const createHandoverTicket = (values: CreateHandoverTicketForm) => {
    setLoading(true);
    equipmentHandover.createHandoverTicket(values, createHandoverTicketModalData.equipment?.id as number, createHandoverTicketDocuments).then((res) => {
      if (res.data.success) {
        toast.success('Tạo phiếu yêu cầu bàn giao thành công');
        callback();
        hideCreateHandoverTicketModal();
      }
    }).catch((err) => {
      toast.error('Tạo phiếu yêu cầu bàn giao thất bại');
      console.log('🚀 ~ file: index.tsx ~ createHandoverTicket ~ err', err);
    }).finally(() => {
      setLoading(false);
    });
  };
  return (<Modal
    width={1000}
    title='Phiếu yêu cầu bàn giao thiết bị'
    open={showCreateHandoverTicketModal}
    onCancel={() => {
      hideCreateHandoverTicketModal();
      form.resetFields();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createHandoverTicket}>
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item label='Tên thiết bị'>
          <Input className='input' disabled value={createHandoverTicketModalData.equipment?.name} />
        </Form.Item>
        <Form.Item
          label=' Khoa phòng nhận bàn giao' name='departmentId'
          required={true}
          rules={[{ required: true, message: 'Vui lòng chọn khoa phòng nhận bàn giao' }]}
        >
          <Select
            showSearch
            placeholder='Khoa - Phòng'
            optionFilterProp='children'
            loading={loading}
            onChange={(value) => {
              setLoading(true);
              userApi.getUsers({ departmentId: value }, { size: 10000 }).then((res) => {
                setResponsiblePersons(res.data.data.content);
              }).finally(() => setLoading(false));
            }}
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={getDepartmentOptions(departments)}
          />
        </Form.Item>
        <Form.Item
          label=' Người phụ trách' name='responsiblePersonId'
          required={true}
          rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
        >
          <Select
            showSearch
            placeholder=' Chọn người phụ trách'
            optionFilterProp='children'
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(responsiblePersons)}
          />
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
          label=' Ngày bàn giao' name='handoverDate' required
          rules={[{ required: true, message: 'Vui lòng chọn ngày bàn giao' }]}
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
        <Form.Item label='Người lập phiếu yêu cầu'>
          <Input className='input' disabled value={getCurrentUser().name} />
        </Form.Item>
        <Form.Item label={'Tải lên tài liệu bàn giao'}>
          <Upload {...uploadProps}  >
            <Button className='modalFileUploadDownloadButton' icon={<UploadOutlined />}> Tải lên tài liệu bàn giao</Button>
          </Upload>
        </Form.Item>

      </div>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateHandoverTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};

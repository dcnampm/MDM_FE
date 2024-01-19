import { CreateLiquidationTicketModalData } from '../../containers/Equipment/Liquidation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Upload, UploadProps } from 'antd';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { getCurrentUser, validateFileSize } from '../../utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../../constants/dateFormat.constants';
import TextArea from 'antd/lib/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';
import { CreateLiquidationTicketForm } from '../../types/equipmentLiquidation.type';
import equipmentLiquidationApi from '../../api/equipment_liquidation.api';

export interface ModalCreateLiquidationTicketProps {
  showCreateLiquidationTicketModal: boolean;
  hideCreateLiquidationTicketModal: () => void;
  callback: () => void;
  createLiquidationTicketModalData: CreateLiquidationTicketModalData;
}


export const ModalCreateLiquidationTicket = (props: ModalCreateLiquidationTicketProps) => {
  const {
    showCreateLiquidationTicketModal, hideCreateLiquidationTicketModal, callback, createLiquidationTicketModalData,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<CreateLiquidationTicketForm>();
  const [createLiquidationTicketDocuments, setCreateLiquidationTicketDocuments] = useState<any[]>([]);
  const initializeForm = () => {
    resetForm();
    form.setFieldsValue({
      createdDate: moment(new Date()),
      liquidationDate: moment(new Date()),
    });
  };
  useEffect(() => {
    initializeForm();
  }, [createLiquidationTicketModalData]);
  const resetForm = () => {
    form.resetFields();
    setCreateLiquidationTicketDocuments([]);
  };
  const uploadProps: UploadProps = {
    name: 'createLiquidationTicketDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setCreateLiquidationTicketDocuments(createLiquidationTicketDocuments.concat(info.file));
    }, onRemove: (file) => {
      setCreateLiquidationTicketDocuments(createLiquidationTicketDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: createLiquidationTicketDocuments, beforeUpload: validateFileSize,
  };
  const createLiquidationTicket = (values: CreateLiquidationTicketForm) => {
    setLoading(true);
    equipmentLiquidationApi.createLiquidationTicket(values, createLiquidationTicketModalData.equipment?.id as number, createLiquidationTicketDocuments).then((res) => {
        toast.success('Tạo phiếu đề xuất thanh lý thành công');
        callback();
        hideCreateLiquidationTicketModal();
    }).finally(() => {
      setLoading(false);
    });

  

  };
 

  return (<Modal width={1000}
    title='Đề xuất thanh lý thiết bị'
    open={showCreateLiquidationTicketModal}
    onCancel={() => {
      hideCreateLiquidationTicketModal();
      resetForm();
    }}
    footer={null}
  >
    <Form form={form} layout='vertical' size='large' onFinish={createLiquidationTicket}>
      <div className='grid grid-cols-2 gap-5'>

        <Form.Item label='Tên thiết bị'>
          <Input className='input' disabled value={createLiquidationTicketModalData.equipment?.name} />
        </Form.Item>
        <Form.Item label='Khoa Phòng hiện tại'>
          <Input className='input' disabled value={createLiquidationTicketModalData.equipment?.department?.name} />
        </Form.Item>
        <Form.Item label=' Giá trị thanh lý' name='price' required
                   rules={[{ required: true, message: 'Vui lòng nhập giá trị thanh lý' },
                   {
                    validator: (rule, value) => {
                    if (isNaN(value)) {
                      return Promise.reject('Giá nhập phải là số!');
                    }
                    return Promise.resolve();
                    },
                  
                  },
                  { pattern: /^\d+$/, message: 'Vui lòng nhập số' }]
                }
        >
          {/* <Input className='input'/> */}
          <InputNumber className='input'
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')} />
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
          label='  Ngày thanh lý' name='liquidationDate' required
          rules={[{ required: true, message: 'Vui lòng chọn ngày thanh lý' }]}
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
        <Form.Item label='Ghi chú thanh lý' name='liquidationNote'>
          <TextArea placeholder='Nhập ghi chú' className='input' />
        </Form.Item>
        <Form.Item label='Người lập phiếu đề xuất'>
          <Input className='input' disabled value={getCurrentUser().name} />
        </Form.Item>
        <Form.Item label={'Tải lên tài liệu thanh lý'}>
          <Upload {...uploadProps}  >
            <Button className='modalFileUploadDownloadButton' icon={<UploadOutlined />}> Tải lên tài liệu thanh lý</Button>
          </Upload>
        </Form.Item>

      </div>
      <div className='flex flex-row justify-end gap-4'>
        <Form.Item>
          <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => hideCreateLiquidationTicketModal()} className='button'>Đóng</Button>
        </Form.Item>
      </div>
    </Form>
  </Modal>);
};

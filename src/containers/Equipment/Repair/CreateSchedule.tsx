import { Button, DatePicker, Divider, Form, Input, InputNumber, Select, Upload, UploadProps } from 'antd';
import categoryApi from 'api/category.api';
import equipmentRepairApi from 'api/equipment_repair.api';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { options, validateFileSize } from 'utils/globalFunc.util';
import BrokenReport from './BrokenReport';
import { CURRENT_USER } from 'constants/auth.constant';
import equipmentApi from 'api/equipment.api';
import { NotificationContext } from 'contexts/notification.context';
import { EquipmentFullInfoDto } from '../../../types/equipment.type';
import { SupplierFullInfoDto } from '../../../types/supplier.type';
import { supplierApi } from '../../../api/supplier.api';
import { DATE_TIME_FORMAT, TIME_FORMAT } from 'constants/dateFormat.constants';
import { UploadOutlined } from '@ant-design/icons';
import { CreateRepairTicketForm } from '../../../types/repair.type';


const { TextArea } = Input;

const CreateSchedule = () => {
  const currentUser: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();
  const param: any = useParams();
  const { equipmentId} = param;
  const [providers, setProviders] = useState<SupplierFullInfoDto[]>([]);
  const [form] = Form.useForm();
  const [status, setStatus] = useState([]);
  const [equipment, setEquipment] = useState<EquipmentFullInfoDto>({});
  const [repairDocuments, setRepairDocuments] = useState<any[]>([]);
  const uploadProps: UploadProps = {
    name: 'repairDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setRepairDocuments(repairDocuments.concat(info.file));
    }, onRemove: (file) => {
      setRepairDocuments(repairDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: repairDocuments, beforeUpload: validateFileSize,
  };
  const getRepairStatus = () => {
    categoryApi.listRepairStatus()
      .then((res: any) => {
        const { data } = res?.data;
        setStatus(data?.repairStatus);
      })
      .catch();
  };

  useEffect(() => {
    getRepairStatus();
    Promise.all([supplierApi.getSuppliers({}, { size: 1000 })]).then(res => {
      const [supplier] = res;
      setProviders(supplier.data.data.content as SupplierFullInfoDto[]);
    });
    form.setFieldsValue({
      createdDate: moment(new Date()), repairStartDate: moment(new Date()),

    });
  }, []);

  useEffect(() => {
    form.setFieldValue('scheduleCreateUserId', currentUser?.id);
    form.setFieldValue('scheduleCreateUserName', currentUser?.name);
  }, [currentUser?.id]);

  useEffect(() => {
    getEquipmentInfo(equipmentId);
  }, [equipmentId]);
  const getEquipmentInfo = (equipmentId: number) => {
    equipmentApi.getEquipmentById(equipmentId).then((res) => {
      setEquipment(res.data.data);
    }).catch(reason => {
      toast.error('Lỗi lấy thông tin thiết bị');
      console.log('Lỗi lấy thông tin thiết bị', reason);
    });
  };
  const createSchedule = (values: CreateRepairTicketForm) => {
    equipmentRepairApi.createRepairTicket(values, equipmentId, repairDocuments).then((res) => {
      toast.success('Tạo lịch sửa chữa thành công');
      navigate(`/equipments/repairs`);
      // increaseCount();
      // getAllNotifications();
    }).catch(reason => {
      toast.error('Lỗi tạo lịch sửa chữa');
      console.log('Lỗi tạo lịch sửa chữa', reason);
    });

  };

  return (<div>
    <div className='title text-center'>TẠO PHIẾU YÊU CẦU SỬA CHỮA THIẾT BỊ</div>
    <Divider />
    <BrokenReport equipment={equipment} />
    <Divider />
    <div>
      <div className='title'>KẾ HOẠCH SỬA CHỮA</div>
      <Form size='large' layout='vertical' form={form} onFinish={createSchedule}>
        <Form.Item name='equipmentId' className='hidden'>
          <Input className='hidden' />
        </Form.Item>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label='Ngày lên lịch sửa' name='createdDate' required>
            <DatePicker
              style={{
                width: '100%',
              }}
              format={DATE_TIME_FORMAT}
              showTime={{ format: TIME_FORMAT }}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label='Ngày sửa chữa' required name='repairStartDate'>
            <DatePicker
              style={{
                width: '100%',
              }}
              format={DATE_TIME_FORMAT}
              showTime={{ format: TIME_FORMAT }}
              allowClear={false}
            />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item
            label='Chi phí sửa chữa dự kiến' required name='estimatedCost'
            rules={[
              // { pattern: /^\d+$/, message: 'Vui lòng nhập số' }, 
              {
                validator: (rule, value) => {
                if (isNaN(value)) {
                  return Promise.reject('Giá nhập phải là số!');
                }
                return Promise.resolve();
                },
              
              },
            {required:true, message:'Chi phí sửa chữa dự kiến không được để trống'}]}
          >
            <InputNumber className='input'
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')} />
          </Form.Item>
          <Form.Item label='Nhà cung cấp dịch vụ' name='repairCompanyId'>
            <Select
              showSearch
              placeholder='Chọn nhà cung cấp dịch vụ'
              optionFilterProp='children'
              options={options(providers)}
              allowClear
            />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <Form.Item label='Người lập kế hoạch sửa chữa' name='scheduleCreateUserName'>
              <Input className='input' disabled />
            </Form.Item>
            <Form.Item label={'Tải lên tài liệu sửa chữa'}>
              <Upload {...uploadProps} >
                <Button className='button' icon={<UploadOutlined />}>Tải lên tài liệu sửa chữa</Button>
              </Upload>
            </Form.Item>
          </div>
          <div>
            <Form.Item label='Ghi chú' name='note'>
              <TextArea className='textarea' rows={5} />
            </Form.Item>
          </div>
        </div>
        <div className='flex gap-6'>
          <Form.Item>
            <Button className='button' htmlType='submit'>Tạo phiếu yêu cầu sửa chữa</Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  </div>);
};

export default CreateSchedule;
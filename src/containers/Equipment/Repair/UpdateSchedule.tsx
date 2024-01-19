import { Button, DatePicker, Divider, Form, Input, Select, Upload, UploadProps } from 'antd';
import equipmentRepairApi from 'api/equipment_repair.api';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrencyVn, getDateForRendering, getRepairStatusOption, showListOfErrors, validateFileSize } from 'utils/globalFunc.util';
import BrokenReport from './BrokenReport';
import { CURRENT_USER } from 'constants/auth.constant';
import equipmentApi from 'api/equipment.api';
import { NotificationContext } from 'contexts/notification.context';
import { SupplierFullInfoDto } from '../../../types/supplier.type';
import { RepairStatus, RepairTicketFullInfoDto, UpdateRepairTicketForm } from '../../../types/repair.type';
import { EquipmentFullInfoDto } from '../../../types/equipment.type';
import { DATE_TIME_FORMAT, TIME_FORMAT } from 'constants/dateFormat.constants';
import { UploadOutlined } from '@ant-design/icons';


const { TextArea } = Input;

interface UpdateScheduleForm {
  repairEndDate?: moment.Moment;
  actualCost?: number;
  repairNote?: string;
  repairStatus?: RepairStatus;
}

const UpdateSchedule = () => {
  const currentUser: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();
  const param: any = useParams();
  const { equipmentId, repairTicketId } = param;
  const [form] = Form.useForm<UpdateScheduleForm>();
  const [equipment, setEquipment] = useState<EquipmentFullInfoDto>({});
  const [providers, setProviders] = useState<SupplierFullInfoDto[]>([]);
  const [repairTicket, setRepairTicket] = useState<RepairTicketFullInfoDto>({});
  const [updateRepairTicketDocuments, setUpdateRepairTicketDocuments] = useState<any[]>([]);
  const uploadProps: UploadProps = {
    name: 'updateRepairTicketDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setUpdateRepairTicketDocuments(updateRepairTicketDocuments.concat(info.file));
    }, onRemove: (file) => {
      setUpdateRepairTicketDocuments(updateRepairTicketDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: updateRepairTicketDocuments, beforeUpload: validateFileSize,
  };

  useEffect(() => {
    Promise.all([
      equipmentApi.getEquipmentById(equipmentId), equipmentRepairApi.getRepairTicketDetail(equipmentId, repairTicketId),
    ]).then((res) => {
      const [equipment, repairTicket] = res;
      setEquipment(equipment.data.data);
      setRepairTicket(repairTicket.data.data);
    });
    form.setFieldsValue({
      repairEndDate: moment(new Date()),
    });
  }, [equipmentId]);


  useEffect(() => {
  }, []);

  const updateSchedule = (values: UpdateScheduleForm) => {
    let repairTicketUpdateForm: UpdateRepairTicketForm = {
      repairEndDate: values.repairEndDate?.toISOString() as string,
      actualCost: values.actualCost,
      repairNote: values.repairNote,
      repairStatus: values.repairStatus as RepairStatus,
    };
    equipmentRepairApi.updateRepairTicket(repairTicketId, equipmentId, repairTicketUpdateForm, updateRepairTicketDocuments).then((res) => {
      navigate(`/equipments/${equipmentId}`);
      // increaseCount();
      // getAllNotifications();
      toast.success('Cập nhật lịch sửa chữa thành công');

    }).catch(reason => {
      toast.error('Cập nhật lịch sửa chữa thất bại');
      showListOfErrors(reason.response.errors);
    });

  };

  return (<div>
    <div className='title text-center'>CẬP NHẬT LỊCH SỬA CHỮA THIẾT BỊ</div>
    <Divider />
    <BrokenReport equipment={equipment} />
    <Divider />
    <div>
      <div className='title'>KẾ HOẠCH SỬA CHỮA</div>
      <Form size='large' layout='vertical' form={form} onFinish={updateSchedule}>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label='Ngày lên lịch sửa'>
            <Input className='date' disabled value={getDateForRendering(repairTicket.createdDate)} />
          </Form.Item>
          <Form.Item label='Ngày sửa chữa'>
            <Input className='date' disabled value={getDateForRendering(repairTicket.repairStartDate)} />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label='Chi phí sửa chữa dự kiến'>
            <Input className='input' disabled value={formatCurrencyVn(repairTicket.estimatedCost as number)} />
          </Form.Item>
          <Form.Item label='Công ty sửa chữa'>
            <Input
              disabled
              className='input'
              value={repairTicket.repairCompany?.name}
            />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item
            label=' Trạng thái sửa chữa' name='repairStatus' required
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái sửa chữa' }]}
          >
            <Select
              showSearch
              placeholder=' Trạng thái sửa chữa'
              optionFilterProp='children'
              options={getRepairStatusOption()}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label=' Ngày kết thúc sửa chữa' name='repairEndDate' required
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc sửa chữa' }]}
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
        </div>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <Form.Item
              label='Chi phí sửa chữa thực tế' required name='actualCost'
              rules={[{ required: true, message: 'Vui lòng nhập chi phí sửa chữa thực tế' }]}
            >
              <Input className='input' />
            </Form.Item>
            <Form.Item label='Người lập kế hoạch sửa chữa'>
              <Input className='input' disabled value={repairTicket.creator?.name} />
            </Form.Item>
          </div>
          <div>
            <Form.Item label='Ghi chú' name='repairNote'>
              <TextArea className='textarea' rows={5} />
            </Form.Item>
          </div>
        </div>
        <Form.Item label={'Tải lên tài liệu sửa chữa'}>
          <Upload {...uploadProps} >
            <Button icon={<UploadOutlined />}>Tải lên tài liệu sửa chữa</Button>
          </Upload>
        </Form.Item>
        <div className='flex gap-6'>
          <Form.Item>
            <Button className='button' htmlType='submit'>Cập nhật</Button>
          </Form.Item>
          {/*<Form.Item>
            <Button className='button'>In phiếu yêu cầu sửa chữa</Button>
          </Form.Item>*/}
        </div>
      </Form>
    </div>
  </div>);
};

export default UpdateSchedule;
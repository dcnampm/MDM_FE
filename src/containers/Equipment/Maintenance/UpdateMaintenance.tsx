import { Button, DatePicker, Divider, Form, Input, Select, Upload, UploadProps } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDateForRendering, options, validateFileSize } from 'utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from 'constants/dateFormat.constants';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import equipmentMaintenance from '../../../api/equipment_maintenance.api';
import { MaintenanceTicketFullInfoDto, UpdateMaintenanceTicketForm } from '../../../types/maintenance.type';
import moment from 'moment';
import { FilterContext } from '../../../contexts/filter.context';

interface UpdateMaintenancePathVariable {
  equipmentId: number;
  maintenanceId: number;
}

const UpdateMaintenance = () => {
  const { equipmentId, maintenanceId } = useParams();

  let navigate = useNavigate();

  const [maintenanceTicketFullInfoDto, setMaintenanceTicketFullInfoDto] = useState<MaintenanceTicketFullInfoDto>({});

  const [form] = Form.useForm<UpdateMaintenanceTicketForm>();

  const { providers } = useContext(FilterContext);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (equipmentId == null || maintenanceId == null) {
      navigate('/equipments/maintenances');
      toast.error(' Không tìm thấy trang');
      return;
    }
    form.setFieldsValue({
      maintenanceDate: moment(new Date()),
    });
    equipmentMaintenance.getMaintenanceTicketDetail(Number(equipmentId), Number(maintenanceId)).then((res) => {
      if (res.data.success) {
        setMaintenanceTicketFullInfoDto(res.data.data);
      }
    }).catch((err) => {
      toast.error('Có lỗi khi tải dữ liệu hoặc trang bạn đang tìm kiếm không tồn tại');
      navigate('/equipments/maintenances');
      console.log('error when get maintenance ticket detail', err);
    });
  }, [equipmentId, maintenanceId]);

  const [maintenanceDocuments, setMaintenanceDocuments] = useState<any[]>([]);

  const uploadProps: UploadProps = {
    name: 'maintenanceDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setMaintenanceDocuments(maintenanceDocuments.concat(info.file));
    }, onRemove: (file) => {
      setMaintenanceDocuments(maintenanceDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: maintenanceDocuments, beforeUpload: validateFileSize,
  };

  const updateMaintenanceTicket = (values: UpdateMaintenanceTicketForm) => {
    setLoading(true);
    equipmentMaintenance.updateMaintenanceTicket(Number(equipmentId), Number(maintenanceId), values, maintenanceDocuments).then((res) => {
      if (res.data.success) {
        toast.success('Cập nhật tiến độ bảo dưỡng thành công');
        navigate('/equipments/maintenances');
      }
    }).catch((err) => {
      toast.error('Có lỗi khi cập nhật tiến độ bảo dưỡng');
      console.log('error when update maintenance ticket', err);
    }).finally(() => {
      setLoading(false);
    });
  };


  return (<div>
    <div className='title text-center'> CẬP NHẬT TIẾN ĐỘ BẢO DƯỠNG THIẾT BỊ</div>
    <div>
      <div className='title'>THÔNG TIN THIẾT BỊ</div>
      <div>Tên: {maintenanceTicketFullInfoDto.equipment?.name}</div>
      <div>Model: {maintenanceTicketFullInfoDto.equipment?.model}</div>
      <div>Serial: {maintenanceTicketFullInfoDto.equipment?.serial}</div>
      <div>Chu kỳ bảo dưỡng: {maintenanceTicketFullInfoDto.equipment?.regularMaintenance} tháng</div>
    </div>
    <Divider></Divider>
    <div>
      <Form size='large' layout='vertical' form={form} onFinish={updateMaintenanceTicket}>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label=' Ngày tạo phiếu'>
            <Input className='input' disabled value={getDateForRendering(maintenanceTicketFullInfoDto.createdDate)} />
          </Form.Item>
          <Form.Item label=' Người tạo phiếu'>
            <Input className='input' disabled value={maintenanceTicketFullInfoDto.creator?.name} />
          </Form.Item>
          <Form.Item label=' Ngày phê duyệt'>
            <Input className='input' disabled value={getDateForRendering(maintenanceTicketFullInfoDto.approvalDate)} />
          </Form.Item>
          <Form.Item label=' Người phê duyệt'>
            <Input className='input' disabled value={maintenanceTicketFullInfoDto.approver?.name} />
          </Form.Item>
          <Form.Item label='Ghi chú của người tạo phiếu'>
            <TextArea className='textarea' rows={2} disabled value={maintenanceTicketFullInfoDto.creatorNote} />
          </Form.Item>
          <Form.Item label='Ghi chú của người phê duyệt'>
            <TextArea className='textarea' rows={2} disabled value={maintenanceTicketFullInfoDto.approverNote} />
          </Form.Item>
        </div>
        <Divider></Divider>
        <div className={'grid grid-cols-2 gap-5'}>
          <Form.Item label=' Ngày bảo dưỡng' name='maintenanceDate' required>
            <DatePicker
              style={{
                width: '100%',
              }}
              format={DATE_TIME_FORMAT}
              showTime={{ format: TIME_FORMAT }}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label=' Chi phí bảo dưỡng' required name='price'
                     rules={[{ pattern: /^\d+$/, message: 'Vui lòng nhập số' }, { required: true, message: 'Vui lòng nhập chi phí bảo dưỡng' }]}
          >
            <Input className='input' />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>

        </div>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <Form.Item label=' Công ty bảo dưỡng' name='maintenanceCompanyId' required
                       rules={[{ required: true, message: 'Vui lòng chọn công ty bảo dưỡng' }]}
            >
              <Select
                showSearch
                placeholder='Chọn công ty bảo dưỡng'
                optionFilterProp='children'
                allowClear
                options={options(providers)}
              />
            </Form.Item>
            <Form.Item label={'Tải lên tài liệu bảo dưỡng'}>
              <Upload {...uploadProps} >
                <Button className='button' icon={<UploadOutlined />}>Tải lên tài liệu bảo dưỡng</Button>
              </Upload>
            </Form.Item>
          </div>
          <div>
            <Form.Item label='Ghi chú' name='maintenanceNote'>
              <TextArea className='textarea' rows={6} />
            </Form.Item>
          </div>
        </div>
        <div className='flex gap-6'>
          <Form.Item>
            <Button className='button' loading={loading} htmlType='submit'>Cập nhật tiến độ bảo dưỡng</Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  </div>);

};
export default UpdateMaintenance;
import { Button, DatePicker, Divider, Form, Input, Select, Upload, UploadProps } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDateForRendering, getInspectionEvaluationStatusesOption, options, validateFileSize } from 'utils/globalFunc.util';
import { DATE_TIME_FORMAT, TIME_FORMAT } from 'constants/dateFormat.constants';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { FilterContext } from '../../../contexts/filter.context';
import { InspectionTicketFullInfoDto, UpdateInspectionTicketForm } from '../../../types/equipmentInspection.type';
import equipmentInspectionApi from '../../../api/equipmentInspection.api';

const UpdateInspection = () => {
  const { equipmentId, inspectionId } = useParams<{ equipmentId?: string, inspectionId?: string }>();

  let navigate = useNavigate();

  const [inspectionTicketFullInfoDto, setInspectionTicketFullInfoDto] = useState<InspectionTicketFullInfoDto>({});

  const [form] = Form.useForm<UpdateInspectionTicketForm>();

  const { providers } = useContext(FilterContext);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (equipmentId == null || inspectionId == null) {
      navigate('/equipments/inspections');
      toast.error(' Không tìm thấy trang');
      return;
    }
    form.setFieldsValue({
      inspectionDate: moment(new Date()),
    });
    equipmentInspectionApi.getInspectionTicketDetail(Number(equipmentId), Number(inspectionId)).then((res) => {
      if (res.data.success) {
        setInspectionTicketFullInfoDto(res.data.data);
      }
    }).catch((err) => {
      toast.error('Có lỗi khi tải dữ liệu hoặc trang bạn đang tìm kiếm không tồn tại');
      navigate('/equipments/inspections');
      console.log('error when get inspection ticket detail', err);
    });
  }, [equipmentId, inspectionId]);

  const [inspectionDocuments, setInspectionDocuments] = useState<any[]>([]);

  const uploadProps: UploadProps = {
    name: 'inspectionDocuments', onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    }, customRequest: (info) => {
      setInspectionDocuments(inspectionDocuments.concat(info.file));
    }, onRemove: (file) => {
      setInspectionDocuments(inspectionDocuments.filter((item: any) => item.uid !== file.uid));
    }, fileList: inspectionDocuments, beforeUpload: validateFileSize,
  };

  const updateInspectionTicket = (values: UpdateInspectionTicketForm) => {
    setLoading(true);
    equipmentInspectionApi.updateInspectionTicket(Number(equipmentId), Number(inspectionId), values, inspectionDocuments).then((res) => {
      if (res.data.success) {
        toast.success('Cập nhật tiến độ kiểm định thành công');
        navigate('/equipments/inspections');
      }
    }).catch((err) => {
      toast.error('Có lỗi khi cập nhật tiến độ kiểm định');
      console.log('error when update inspection ticket', err);
    }).finally(() => {
      setLoading(false);
    });
  };


  return (<div>
    <div className='title text-center'> CẬP NHẬT TIẾN ĐỘ KIỂM ĐỊNH THIẾT BỊ</div>
    <div>
      <div className='title'>THÔNG TIN THIẾT BỊ</div>
      <div>Tên: {inspectionTicketFullInfoDto.equipment?.name}</div>
      <div>Model: {inspectionTicketFullInfoDto.equipment?.model}</div>
      <div>Serial: {inspectionTicketFullInfoDto.equipment?.serial}</div>
      <div>Chu kỳ kiểm định: {inspectionTicketFullInfoDto.equipment?.regularInspection} tháng</div>
    </div>
    <Divider></Divider>
    <div>
      <Form size='large' layout='vertical' form={form} onFinish={updateInspectionTicket}>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label=' Ngày tạo phiếu'>
            <Input className='input' disabled value={getDateForRendering(inspectionTicketFullInfoDto.createdDate)} />
          </Form.Item>
          <Form.Item label=' Người tạo phiếu'>
            <Input className='input' disabled value={inspectionTicketFullInfoDto.creator?.name} />
          </Form.Item>
          <Form.Item label=' Ngày phê duyệt'>
            <Input className='input' disabled value={getDateForRendering(inspectionTicketFullInfoDto.approvalDate)} />
          </Form.Item>
          <Form.Item label=' Người phê duyệt'>
            <Input className='input' disabled value={inspectionTicketFullInfoDto.approver?.name} />
          </Form.Item>
          <Form.Item label='Ghi chú của người tạo phiếu'>
            <TextArea className='textarea' rows={2} disabled value={inspectionTicketFullInfoDto.creatorNote} />
          </Form.Item>
          <Form.Item label='Ghi chú của người phê duyệt'>
            <TextArea className='textarea' rows={2} disabled value={inspectionTicketFullInfoDto.approverNote} />
          </Form.Item>
        </div>
        <Divider></Divider>
        <div className={'grid grid-cols-2 gap-5'}>
          <Form.Item label=' Ngày kiểm định' name='inspectionDate' required>
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
            label=' Chi phí kiểm định' required name='price'
            rules={[{ pattern: /^\d+$/, message: 'Vui lòng nhập số' }, { required: true, message: 'Vui lòng nhập chi phí kiểm định' }]}
          >
            <Input className='input' />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>

        </div>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <Form.Item
              label=' Công ty kiểm định' name='inspectionCompanyId' required
              rules={[{ required: true, message: 'Vui lòng chọn công ty kiểm định' }]}
            >
              <Select
                showSearch
                placeholder='Chọn công ty kiểm định'
                optionFilterProp='children'
                allowClear
                options={options(providers)}
              />
            </Form.Item>
            <Form.Item
              label=' Tình trạng thiết bị' name='evaluationStatus' required
              rules={[{ required: true, message: 'Vui lòng đánh giá tình trạng thiết bị' }]}
            >
              <Select
                showSearch
                placeholder=' Chọn đánh giá tình trạng thiết bị'
                optionFilterProp='children'
                allowClear
                options={getInspectionEvaluationStatusesOption()}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item label='Ghi chú' name='inspectionNote'>
              <TextArea className='textarea' rows={6} />
            </Form.Item>
          </div>
        </div>
        <Form.Item label={'Tải lên tài liệu kiểm định'}>
          <Upload {...uploadProps} >
            <Button icon={<UploadOutlined />}>Tải lên tài liệu kiểm định</Button>
          </Upload>
        </Form.Item>
        <div className='flex gap-6'>
          <Form.Item>
            <Button className='button' loading={loading} htmlType='submit'>Cập nhật tiến độ kiểm định</Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  </div>);

};
export default UpdateInspection;

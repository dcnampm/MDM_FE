import { Button, DatePicker, Divider, Form, Input, Select } from 'antd';
import React, { useContext, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, getCycleOption, getRiskLevelOptions, options } from 'utils/globalFunc.util';
import { useNavigate } from 'react-router-dom';
import { FilterContext } from 'contexts/filter.context';
import categoryApi from 'api/category.api';
import { toast } from 'react-toastify';
import { UpsertSupplyForm } from '../../types/supply.type';
import supplyApi from '../../api/supply.api';

const { Option } = Select;
const { TextArea } = Input;

const CreateSupply = () => {

  const { supplyCategories, providers, projects, supplyUnits } = useContext(FilterContext);
  const navigate = useNavigate();
  const [form] = Form.useForm<UpsertSupplyForm>();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [type, setType] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [imageToBeUploaded, setImageToBeUploaded] = useState<any>(null);
  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    setImageToBeUploaded(file);
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const createSupply = (form: UpsertSupplyForm) => {
    supplyApi.createSupply(form).then((res) => {
      navigate(`/supplies/${res.data.data.id}`);
      toast.success('Tạo vật tư thành công!');
    });
  };

  const onChangeGroup = (value: any) => {
    categoryApi.listTypeBaseGroup(value)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setType(data?.types);
        }
      })
      .catch();
  };

  return (<div>
    <div className='flex-between-center'>
      <div className='title'>NHẬP VẬT TƯ</div>
    </div>
    <Divider />
    <div className=''>
      <Form
        form={form}
        className=''
        layout='vertical'
        size='large'
        onFinish={createSupply}
      >
        <div className='grid grid-cols-3 gap-5'>
          <Form.Item
            label='Tên vật tư'
            name='name'
            required
            rules={[{ required: true, message: 'Hãy nhập tên vật tư!' }]}
            className='mb-5'
          >
            <Input placeholder='Nhập tên vật tư' allowClear className='input' />
          </Form.Item>
          <Form.Item
            label=' Model'
            required
            rules={[{ required: true, message: ' Hãy nhập Model' }]}
            className='mb-5'
            name='model'
          >
            <Input
              placeholder=' Nhập Model vật tư' allowClear className='input'
            />
          </Form.Item>
          <Form.Item
            name='serial'
            label=' Serial'
            required
            rules={[{ required: true, message: ' Hãy nhập Serial' }]}
            className='mb-5'
          >
            <Input
              placeholder=' Nhập Serial vật tư' allowClear className='input'
            />
          </Form.Item>
          <Form.Item
            label='Mã vật tư'
            name='hashCode'
            required
            rules={[{ required: true, message: 'Hãy nhập mã vật tư!' }]}
            className='mb-5'
          >
            <Input
              placeholder='Nhập mã vật tư' allowClear className='input'
            />
          </Form.Item>

          <Form.Item
            label='Loại vật tư'
            name='categoryId'
            required
            rules={[{ required: true, message: 'Hãy chọn loại vật tư!' }]}
            className='mb-5'
          >
            <Select
              showSearch
              placeholder='Chọn loại vật tư'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(supplyCategories)}
            />
          </Form.Item>

          <Form.Item
            label='Đơn vị tính'
            name='unitId'
            required
            rules={[{ required: true, message: 'Hãy chọn đơn vị tính vật tư!' }]}
            className='mb-5'
          >
            <Select
              showSearch
              placeholder='Chọn đơn vị tính'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(supplyUnits)}
            />
          </Form.Item>
          <Form.Item
            label='Mức độ rủi ro'
            name='riskLevel'
            required
            rules={[{ required: true, message: 'Hãy chọn mức độ rủi ro của vật tư!' }]}
            className='mb-5'
          >
            <Select
              showSearch
              placeholder='Chọn mức độ rủi ro'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={getRiskLevelOptions()}
            />
          </Form.Item>
          <Form.Item
            label='Giá nhập' name='importPrice' className='mb-5'
            rules={[{ pattern: /^[0-9]*$/, message: 'Giá nhập phải là số' }]}
          >
            <Input placeholder='Nhập giá vật tư' allowClear className='rounded-lg h-9 border-[#A3ABEB] border-2' />
          </Form.Item>


          <Form.Item
            label=' Số lượng' name='amount' className='mb-5'
            required={true}
            rules={[{ pattern: /^[0-9]*$/, message: ' Số lượng phải là số' }]}
          >
            <Input placeholder=' Nhập số lượng' allowClear className='rounded-lg h-9 border-[#A3ABEB] border-2' />
          </Form.Item>
          <Form.Item
            label=' Số lượng đã dùng' name='amountUsed' className='mb-5' hidden={true}
          >
            <Input placeholder=' Nhập số lượng đã dùng' value={0} allowClear className='rounded-lg h-9 border-[#A3ABEB] border-2' />
          </Form.Item>
          <Form.Item
            label='Hãng sản xuất'
            name='manufacturer'
            className='mb-5'
          >
            <Input placeholder='Nhập hãng sản xuất của vật tư' allowClear className='input' />
          </Form.Item>
          <Form.Item
            label='Xuất xứ'
            name='manufacturingCountry'
            className='mb-5'
          >
            <Input placeholder='Nhập xuất xứ của vật tư' allowClear className='input' />
          </Form.Item>
          <Form.Item
            label='Năm sản xuất'
            name='yearOfManufacture'
            className='mb-5'
            rules={[
              { pattern: /^[0-9]*$/, message: 'Năm sản xuất phải là số!' }, { min: 4, max: 4, message: 'Năm sản xuất phải có 4 chữ số!' },
            ]}
          >
            <Input placeholder='Nhập năm sản xuất của vật tư' allowClear className='input' />
          </Form.Item>
          <Form.Item label='Nhà cung cấp' name='providerId' className='mb-5'>
            <Select
              showSearch
              placeholder='Chọn nhà cung cấp'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(providers)}
            />
          </Form.Item>

          <Form.Item label='Ngày nhập kho' name='warehouseImportDate' className='mb-5'>
            <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày' />
          </Form.Item>
          <Form.Item label=' Ngày hết hạn' name='expiryDate' className='mb-5'>
            <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày' />
          </Form.Item>
        </div>

        <div className='grid grid-cols-2 gap-5'>
          <Form.Item
            label='Giá trị ban đầu' name='initialValue' className='mb-5'
            rules={[{ pattern: /^[0-9]*$/, message: 'Giá trị ban đầu phải là số!' }]}
          >
            <Input placeholder='Nhập giá trị ban đầu của vật tư' allowClear className='input' />
          </Form.Item>
          <Form.Item
            label='Khấu hao hàng năm' name='annualDepreciation' className='mb-5'

            rules={[{ pattern: /^[0-9]*$/, message: 'Khấu hao hàng năm phải là số!' }]}
          >
            <Input placeholder='Nhập Khấu hao hàng năm' allowClear className='input' />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-5'>

          <Form.Item label='Thông số kĩ thuật' name='technicalParameter' className='mb-5'>
            <TextArea placeholder='Thông số kĩ thuật' rows={4} className='textarea' />
          </Form.Item>
          <Form.Item label='Cấu hình kĩ thuật' name='configuration' className='mb-5'>
            <TextArea placeholder='Cấu hình kĩ thuật' rows={4} className='textarea' />
          </Form.Item>
        </div>
        <div  className='grid grid-cols-2 gap-5'>

          <Form.Item
            label='Năm sử dụng' name='yearInUse' className='mb-5'
            rules={[
              { pattern: /^[0-9]*$/, message: 'Năm sử dụng phải là số' }, { min: 4, max: 4, message: 'Năm sản xuất phải có 4 chữ số!' },
            ]}
          >
            <Input placeholder='Nhập năm sử dụng của vật tư' allowClear className='input' />
          </Form.Item>
          <Form.Item label='Dự án' name='projectId' className='mb-5'>
            <Select
              showSearch
              placeholder='Chọn dự án'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={options(projects)}
            >
            </Select>
          </Form.Item>

        </div>
        <div className='grid grid-cols-2 gap-5'>
          <Form.Item label='Ghi chú' name='note' className='mb-5'>
            <TextArea placeholder='Ghi chú' rows={4} className='textarea' />
          </Form.Item>
          <Form.Item label='Quy trình sử dụng' name='usageProcedure' className='mb-5'>
            <TextArea placeholder='Quy trình sử dụng' rows={4} className='textarea' />
          </Form.Item>
        </div>
        <Form.Item>
          <Button className='button' htmlType='submit' loading={loading}>Thêm</Button>
        </Form.Item>
      </Form>
    </div>
  </div>);
};

export default CreateSupply;

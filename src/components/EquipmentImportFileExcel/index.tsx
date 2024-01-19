import * as fs from 'file-saver';
import { Button, Form, Input, Select, Spin, Upload } from 'antd';
import { FileExcelFilled, UploadOutlined } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { addRow, getDepartmentOptions, getStatusOptionForExcelImport, getStatusesOption, options } from 'utils/globalFunc.util'; 
import { EquipmentImportExcelForm, UpsertEquipmentForm } from 'types/equipment.type';
import { FilterContext } from 'contexts/filter.context';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import equipmentApi from 'api/equipment.api';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'antd/lib/form/Form';

const EquipmentImportFileExcel = () => {
  const downloadExampleExcel = () => {
    const link = document.createElement('a');
    link.download = 'File_mau_nhap_thiet_bi';
    link.href = '/documents/File_mau_nhap_thiet_bi.xlsx';
    link.click();
  }
  
  const [form] = Form.useForm<EquipmentImportExcelForm>();
  const { departments, statuses} = useContext(FilterContext);
  const navigate = useNavigate();
  const [imageToBeUploaded, setImageToBeUploaded] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    setImageToBeUploaded(file);
  };
  const createEquipmentExcel = (form: EquipmentImportExcelForm) => {
    setLoading(true);
    equipmentApi.importExcel(form, imageToBeUploaded).then((res) => {
      setLoading(false);
      navigate(`/equipments`);
      toast.success('Tạo thiết bị thành công!');
    }).catch((err) => {
      toast.error(err.response.data.message);
      setLoading(false);
    }).finally(() => {
      // form.resetFields();
    })
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>NHẬP THIẾT BỊ BẰNG EXCEL</div>
      {/*<Button className='button_excel'>
        <ImportOutlined />
        <div
          className='font-medium text-md text-[#5B69E6]'
          onClick={() => navigate('/equipment/import_excel_eq')}
        >Nhập Excel
        </div>
      </Button>*/}
      <Button className="button_excel" onClick={() => downloadExampleExcel()}>
      <FileExcelFilled />
      <div className="font-medium text-md text-[#5B69E6]">EXCEL mẫu</div>
      </Button>
    </div>
      
      <Form
        form={form}
        className='basis-2/3'
        layout='vertical'
        size='large'
        onFinish={createEquipmentExcel}
      >
        <Form.Item
            label='Khoa phòng'
            required
            name='departmentId'
            rules={[{ required: true, message: ' Hãy chọn khoa phòng của thiết bị!' }]}>
            <Select
              showSearch
              placeholder='Chọn khoa phòng'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={getDepartmentOptions(departments)}
              onChange={value => {
                form.setFieldsValue({ departmentId: value });
              }}
              onClear={() => form.setFieldsValue({ departmentId: undefined })}
            />
          </Form.Item>
          <Form.Item
            label='Trạng thái' className='mb-5'
            required
            name='status'
            rules={[{ required: true, message: ' Hãy chọn trạng thái của thiết bị!' }]}>
            <Select
              showSearch
              placeholder='Chọn trạng thái'
              optionFilterProp='children'
              allowClear
              filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
              options={getStatusOptionForExcelImport()}
              onChange={value => {
                form.setFieldsValue({ status: value });
              }}
              onClear={() => form.setFieldsValue({ status: undefined })}
            />
          </Form.Item>
          <Form.Item

            label='Tải lên file'
            name='excelFile'
            required
            rules={[{ required: true, message: 'Hãy tải lên file excel!' }]}
            className='mb-5'
          >
            <Input type='file' size='small' placeholder='File excel' allowClear className='input' onChange={(e: any) => handleChangeImg(e)}/>
          </Form.Item>
          
          <Form.Item>
          <Button className='button' htmlType='submit' loading={loading}>
            Thêm
          </Button>
        </Form.Item>
      </Form>

  </div>
  );
};




export default EquipmentImportFileExcel;


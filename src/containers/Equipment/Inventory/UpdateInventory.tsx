import { Button, DatePicker, Divider, Form, Input } from 'antd';
import equipmentInventoryApi from 'api/equipment_inventory.api';
import { inventory_status } from 'constants/dataFake.constant';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const { TextArea } = Input;

const UpdateInventory = () => {

  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { user } = useContext(FilterContext);

  const handleInventoryStatus = (status: any) => {
    return inventory_status.filter((item: any) => item.value === status)[0]?.label;
  }

  const getInventoryInfo = () => {
    equipmentInventoryApi.getInventoryInfo(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        let equipment = data?.equipment;
        if (success) {
          form.setFieldsValue({
            id: equipment?.id,
            equipment_id: equipment?.Equipment?.id,
            name: equipment?.Equipment?.name,
            model: equipment?.Equipment?.model,
            serial: equipment?.Equipment?.serial,
            inventory_create_user: equipment?.inventory_create_user?.name,
            inventory_date: moment(equipment?.inventory_date),
            times: equipment.times,
            note: equipment.note,
            status: equipment.status,
            status_name: handleInventoryStatus(equipment.status)
          })
        }
      })
  }

  useEffect(() => {
    getInventoryInfo();
  }, [id])

  const handleUpdateInventoryInfo = (values: any) => {
    let data = {
      ...values,
      inventory_date: new Date().toISOString(),
      inventory_create_user: user?.id
    }
    setLoading(true);
    equipmentInventoryApi.updateInventoryNote(data)
      .then((res: any) => {
        const { success } = res.data;
        if(success) {
          toast.success("Cập nhật thông tin kiểm kê thành công!");
        } else {
          toast.error("Cập nhật thông tin kiểm kê thất bại!");
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CẬP NHẬT THÔNG TIN KIỂM KÊ</div>
      </div>
      <Divider />
      <Form form={form} layout="vertical" size="large" onFinish={handleUpdateInventoryInfo}>
        <Form.Item name="id" className='hidden' />
        <Form.Item name="equipment_id" className='hidden' />
        <Form.Item name="status" className='hidden' />
        <Form.Item label="Tên thiết bị" name="name">
          <Input className='input' disabled />
        </Form.Item>
        <div className='grid grid-cols-2 gap-4'>
          <Form.Item label="Model" name="model">
            <Input className='input' disabled />
          </Form.Item>
          <Form.Item label="Serial" name="serial">
            <Input className='input' disabled />
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Form.Item label="Người phụ trách" name="inventory_create_user">
            <Input className='input' disabled />
          </Form.Item>
          <Form.Item label="Ngày thực hiện" name="inventory_date">
            <DatePicker className='input w-[-webkit-fill-available]' placeholder='Chọn ngày' format="DD-MM-YYYY"/>
          </Form.Item>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Form.Item label="Lần kiểm kê" name="times">
            <Input className='input' disabled />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status_name">
            <Input className='input' disabled />
          </Form.Item>
        </div>
        <Form.Item label="Ghi chú" name="note">
          <TextArea className='input' rows={4} />
        </Form.Item>
        <Form.Item>
          <Button className='button' htmlType='submit' loading={loading}>Cập nhật</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UpdateInventory
import { Button, Form, Input, Modal } from 'antd';
import equipmentLiquidation from 'api/equipment_liquidation.api';
import { CURRENT_USER } from 'constants/auth.constant';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ModelLiquidation = (props: any) => {
  const {
    showLiquidationModal,
    setShowLiquidationModal,
    equipment
  } = props;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');

  useEffect(() => {
    form.setFieldsValue({
      equipment_id: equipment?.id,
      name: equipment?.name,
      department: equipment?.department,
      department_id: equipment?.department_id,
      create_user_id: user?.id,
    })
  }, [equipment?.id])

  const liquidationEquipment = (values: any) => {
    let data = { 
      ...values, 
      liquidation_date: new Date().toISOString(), 
      liquidation_status: 0 
    }
    setLoading(true)
    equipmentLiquidation.createLiquidationNote(data)
      .then((res: any) => {
        const { success } = res?.data;
        if(success) {
          toast.success("Tạo phiếu thành công");
        } else {
          toast.error("Tạo phiếu thất bại")
        }
      })
      .catch(() => toast.error("Tạo phiếu thất bại"))
      .finally(() => {
        setShowLiquidationModal();
        setLoading(false);
      })
  }

  return (
    <Modal
      title="Phiếu đề nghị thanh lý thiết bị"
      open={showLiquidationModal}
      onCancel={setShowLiquidationModal}
      footer={null}
    >
      <Form
        form={form}
        
        layout="vertical"
        size="large"
        onFinish={liquidationEquipment}
      >
        <Form.Item name="equipment_id" required style={{ display: "none" }}>
          <Input style={{ display: "none" }} />
        </Form.Item>
        <Form.Item name="department_id" required style={{ display: "none" }}>
          <Input style={{ display: "none" }} />
        </Form.Item>
        <Form.Item label="Tên thiết bị" name="name">
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item label="Khoa - Phòng" name="department">
          <Input className='input' disabled />
        </Form.Item>
        <Form.Item label="Ngày tạo phiếu">
          <Input disabled className='input' value={moment(new Date()).format("DD-MM-YYYY")} />
        </Form.Item>
        <Form.Item name="create_user_id" style={{ display: 'none' }}></Form.Item>
        <Form.Item label="Người tạo phiếu">
          <Input value={user?.name} className='input' disabled />
        </Form.Item>
        <Form.Item
          label="Lý do thanh lý"
          name="reason"
          required
          rules={[{ required: true, message: 'Hãy nhập lý do!' }]}
        >
          <TextArea placeholder='Nhập tại đây...' rows={4} className='textarea'/>
        </Form.Item>
        <div className='flex flex-row justify-end gap-4'>
          <Form.Item>
            <Button htmlType="submit" loading={loading} className='button'>Xác nhận</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setShowLiquidationModal(false)} className='button'>Đóng</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default ModelLiquidation
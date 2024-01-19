import { CheckCircleFilled, EditFilled } from '@ant-design/icons';
import { Button, Divider, Form, Input, Menu, Modal, Radio, Table, Tooltip } from 'antd';
import equipmentLiquidationApi from 'api/equipment_liquidation.api';
import { CURRENT_USER } from 'constants/auth.constant';
import { liquidation_status } from 'constants/dataFake.constant';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const LiquidationDetail = () => {
  const param: any = useParams();
  const { id } = param;
  const [equipment, setEquipment] = useState<any>([]);
  const [data, setData] = useState<any>({});
  const columns: any = [
    {
      title: 'Người tạo phiếu',
      key: 'create_user_id',
      show: true,
      widthExcel: 35,
      render: (item: any) => (
        <>{item?.create_user?.name}</>
      )
    },
    {
      title: 'Ngày tạo phiếu',
      key: 'liquidation_date',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <>{item?.liquidation_date && moment(item?.liquidation_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Lý do thanh lý',
      key: 'reason',
      show: true,
      widthExcel: 25,
      dataIndex: 'reason'
    },
    {
      title: 'Tình trạng xử lý',
      key: 'liquidation_status',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{handleLiquidationStatus(item?.liquidation_status)}</>
      )
    },
    {
      title: 'Người phê duyệt',
      key: 'approver_id',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <>{item?.approver?.name}</>
      )
    },
    {
      title: 'Ghi chú',
      key: 'note',
      dataIndex: 'note',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className='flex flex-row'>
          {
            item?.liquidation_status !== 1 &&
            <Menu.Item key="approver">
              <Tooltip title='Phê duyệt'>
                <EditFilled onClick={() => setLiquidationApproveField()} />
              </Tooltip>
            </Menu.Item>
          }
          {
            item?.liquidation_status === 1 &&
            <Menu.Item key="liquidation_word">
              <Tooltip title='Hoàn thành'>
                <CheckCircleFilled />
              </Tooltip>
            </Menu.Item>
          }
        </Menu>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLiquidationApproveModal, setShowLiquidationApproveModal] = useState<boolean>(false);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const getLiquidationDetail = (id: number) => {
    equipmentLiquidationApi.getLiquidationDetail(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {       
          let equipment = [];
          let x: any = data?.equipment;
          // let y: any = {
          //   name: x?.Equipment?.name,
          //   model: x?.Equipment?.model,
          //   serial: x?.Equipment?.serial,
          //   department: x?.Equipment?.RoleManagement?.name,
          //   liquidation_date: moment(x?.liquidation_date).format("DD-MM-YYYY"),
          //   reason: x?.reason,
          //   note: x?.note,
          //   create_user: x?.create_user?.name,
          //   approver: x?.approver?.name
          // };
          // setData(y);
          // equipment.push(x);
          setEquipment(x);

        }
      })
      .catch()
  }

  useEffect(() => {
    getLiquidationDetail(id);
  }, [id])

  const handleLiquidationStatus = (status: any) => {
    return liquidation_status.filter((item: any) => item.value === status)[0]?.label;
  }

  const setLiquidationApproveField = () => {
    setShowLiquidationApproveModal(true);
    form.setFieldsValue({
      approver_id: user?.id,
      equipment_id: +id
    })
  }

  const handleApproverLiquidationNote = (values: any) => {
    let data = {
      ...values,
      equipment_name: equipment[0]?.Equipment?.name,
      department_name: equipment[0]?.Equipment?.Department?.name,
      department_id: equipment[0]?.Equipment?.Department?.id
    }
    setLoading(true);
    equipmentLiquidationApi.approveLiquidationNote(data)
      .then((res: any) => {
        const { success } = res?.data;
        if (success) {
          toast.success("Phê duyệt thành công");
          getLiquidationDetail(id);
        } else {
          toast.error("Phê duyệt thất bại")
        }
        setShowLiquidationApproveModal(false);
      })
      .catch()
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <div className="title text-center">PHIẾU YÊU CẦU THANH LÝ THIẾT BỊ</div>
      <Divider />
      <div>
        <div className='title'>THÔNG TIN THIẾT BỊ</div>
        <div>Tên: {equipment[0]?.Equipment?.name}</div>
        <div>Khoa Phòng: {equipment[0]?.Equipment?.Department?.name}</div>
        <div>Model: {equipment[0]?.Equipment?.model}</div>
        <div>Serial: {equipment[0]?.Equipment?.serial}</div>
      </div>
      <Divider />
      <div className='flex flex-row justify-between'>
        <div className='title'>CHI TIẾT PHIẾU YÊU CẦU THANH LÝ</div>
        {/* {
          equipment[0]?.liquidation_status === 1 &&
          <Button
            className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
            onClick={() => downloadLiquidationDocx(data)}
          >
            <FileWordFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất biên bản thanh lý</div>
          </Button>
        } */}
      </div>

      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={equipment}
        className="mt-6 shadow-md"
        pagination={false}
      />
      <Modal
        title="Phê duyệt phiếu đề nghị thanh lý thiết bị"
        open={showLiquidationApproveModal}
        onCancel={() => setShowLiquidationApproveModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          size="large"
          onFinish={handleApproverLiquidationNote}
        >
          <Form.Item name='equipment_id' style={{ display: 'none' }}></Form.Item>
          <Form.Item name='approver_id' style={{ display: 'none' }}></Form.Item>
          <Form.Item label='Người phê duyệt'>
            <Input disabled className='input' value={user?.name} />
          </Form.Item>
          <Form.Item
            label='Trạng thái phê duyệt'
            name='liquidation_status'
            required
            rules={[{ required: true, message: 'Hãy chọn mục này!' }]}
          >
            <Radio.Group>
              <Radio value={1}>Đồng ý</Radio>
              <Radio value={2}>Không đồng ý</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='Ghi chú' name='note'>
            <TextArea placeholder='Nhập ghi chú' rows={4} className='textarea' />
          </Form.Item>
          <div className='flex flex-row justify-end gap-4'>
            <Form.Item>
              <Button htmlType="submit" className='button' loading={loading}>Xác nhận</Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={() => setShowLiquidationApproveModal(false)} className='button'>Đóng</Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default LiquidationDetail
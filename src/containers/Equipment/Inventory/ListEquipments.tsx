import { ClockCircleFilled, EditFilled, FilterFilled, SelectOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Pagination, Row, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import useQuery from 'hooks/useQuery';
import useSearchName from 'hooks/useSearchName';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ava from 'assets/logo.png';
import { getCurrentUser, onChangeCheckbox } from 'utils/globalFunc.util';
import ExportToExcel from 'components/Excel';
import equipmentInventoryApi from 'api/equipment_inventory.api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { inventory_status } from 'constants/dataFake.constant';
import { NotificationContext } from 'contexts/notification.context';

const limit: number = 10;
const { TextArea } = Input;

const TableFooter = ({
  paginationProps
}: any) => {

  return (
    <Row
      justify='space-between'
    >
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  )
}

const ListEquipments = () => {

  const { increaseCount, getAllNotifications } = useContext(NotificationContext);
  const user = getCurrentUser();
  const { onChangeSearch } = useSearchName();
  const params = useParams();
  const { id } = params
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const currentPage = query?.page;
  const currentName = query?.name;
  const [equipments, setEquipments] = useState<any>([]);
  const [allEquipments, setAllEquipments] = useState<any>([]);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  const [isDoneInventory, setIsDoneInventory] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [equipmentIds, setEquipmentIds] = useState<any>([]);
  const columns: any = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      show: false,
      widthExcel: 25,
      render: (item: any) => (
        <img
          src={ava}
          alt="logo"
          className='w-20 h-20'
        />
      )
    },
    {
      title: 'Khoa phòng',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <div>{item?.Department?.name}</div>
      )
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Mã hóa thiết bị',
      dataIndex: 'code',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      show: true,
      widthExcel: 40,
    },
    {
      title: 'Serial',
      dataIndex: 'serial',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Ngày kiểm kê gần nhất',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Inventories?.length > 0 ? moment(item?.Inventories[item?.Inventories?.length - 1]?.inventory_date).format("DD-MM-YYYY") : ''}</>
      )
    },
    {
      title: 'Ghi chú',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Inventories?.length > 0 ? item?.Inventories[item?.Inventories?.length - 1]?.note : ''}</>
      )
    },
    {
      title: 'Lần kiểm kê',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Inventories?.length > 0 ? item?.Inventories[item?.Inventories?.length - 1]?.times : ''}</>
      )
    },
    {
      title: 'Trạng thái kiểm kê',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.Inventories?.length > 0 ? handleInventoryStatus(item?.Inventories[item?.Inventories?.length - 1]?.status) : ''}</>
      )
    },
    {
      title: 'Tác vụ',
      show: true,
      render: (item: any) => (
        <div className='flex items-center'>
          <Tooltip title='Lịch sử kiểm kê thiết bị' className='mr-4'>
            <Link to={`/inventories/history_inventory_equipment/${item?.id}`}><ClockCircleFilled /></Link>
          </Tooltip>
          {
            item?.Inventories[item?.Inventories?.length - 1]?.status === 0 &&
            <Tooltip title='Cập nhật thông tin kiểm kê' className='mr-4'>
              <Link to={`/inventories/update/${item?.id}`}><EditFilled /></Link>
            </Tooltip>
          }
        </div>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

  const handleInventoryStatus = (status: any) => {
    return inventory_status.filter((item: any) => item.value === status)[0]?.label;
  }

  const onPaginationChange = (page: number) => {
    setPage(page);
    let newSearchQuery: any = { page, ...searchQuery };
    setSearchQuery(newSearchQuery);
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  }

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} Thiết bị`,
    onChange: onPaginationChange,
  }

  const getListEquipmentsOfDepartment = () => {
    setLoading(true);
    equipmentInventoryApi.getListEquipmentsOfDepartment({ page, name, department_id: id })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          let equipments = data?.equipments?.rows?.map((item: any) => ({ ...item, key: item?.id?.toString() }));
          setEquipments(equipments);
          setTotal(data?.equipments?.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getListEquipmentsOfDepartment();
  }, [nameSearch, page, id])

  const getAllListEquipmentsOfDepartment = () => {
    equipmentInventoryApi.getListEquipmentsOfDepartment({ name, department_id: id })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          let equipments = data?.equipments;
          setAllEquipments(equipments.map((item: any) => item.id));
          let isDoneInventory: boolean =
            equipments.every(
              (item: any) => item?.Inventories?.length > 0 ?
                item?.Inventories[item?.Inventories?.length - 1]?.status === 0 : false
            );
          setIsDoneInventory(isDoneInventory);
        }
      })
      .catch()
  }

  useEffect(() => {
    getAllListEquipmentsOfDepartment();
  }, [nameSearch, id])

  const rowSelection: any = {
    onChange: (selectedRowKeys: any) => {
      setEquipmentIds(selectedRowKeys)
    },
    selectedRowKeys: equipmentIds,
    preserveSelectedRowKeys: true,
    getCheckboxProps: (record: any) => ({
      disabled: record?.Inventories?.length > 0 ?
        record?.Inventories[record?.Inventories?.length - 1]?.status === 0
        : record?.Inventories[0]?.status === 0
    }),

  };

  const onChangeCountSupply = (record: any, e: any) => {
    let newData = equipments.map((item: any) => {
      if (item.id === record.id) {
        item.note = e?.target?.value;
      }
      return item;
    });
    setEquipments(newData);
  }

  const handleCreateInventory = () => {
    const inventoryData = equipments
      .filter((equipment: any) => equipmentIds.some((id: any) => equipment.id === +id))
      .map((item: any) => (
        {
          equipment_id: item.id,
          name: item.name,
          department: item?.Department?.name,
          note: item.note,
          inventory_date: new Date().toISOString(),
          inventory_create_user_id: user?.id,
          times: item?.Inventories?.length > 0 ? item?.Inventories[item?.Inventories?.length - 1]?.times + 1 : 1,
          status: 0,
          user_id: user.id
        }))
    setLoadingConfirm(true);
    equipmentInventoryApi.createInventoryNotes(inventoryData)
      .then(async (res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Tạo thông tin kiểm kê thành công!');
          getListEquipmentsOfDepartment();
          getAllListEquipmentsOfDepartment();
          increaseCount();
          getAllNotifications();
        } else {
          toast.error('Tạo thông tin kiểm kê thất bại!');
        }
      })
      .catch()
      .finally(() => setLoadingConfirm(false))
  }

  const handleDoneInventory = () => {
    let times = equipments[0]?.Inventories[0]?.times;
    let data = { equipmentIds: allEquipments, times, inventory_approve_user: user.id }
    setLoadingDone(true);
    equipmentInventoryApi.approveInventoryNotes(data)
      .then((res: any) => {
        const { success } = res?.data;
        if (success) {
          toast.success("Hoàn tất qui trình kiểm kê!");
          getListEquipmentsOfDepartment();
          getAllListEquipmentsOfDepartment();
        } else {
          toast.error("Thất bại!");
        }
      })
      .catch()
      .finally(() => setLoadingDone(false))
  }

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ CẦN KIỂM KÊ</div>
        <div className='flex flex-row gap-6'>
          {/* <ExportToExcel /> */}
        </div>
      </div>
      <Divider />
      <div className="flex justify-between flex-col">
        <div
          className='flex flex-row gap-4 items-center mb-4'
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className='font-medium text-center cursor-pointer text-base'>Tùy chọn trường hiển thị</div>
        </div>
        {
          isShowCustomTable &&
          <div className='flex flex-row gap-4'>
            {
              columnTable.length > 0 && columnTable.map((item: any) => (
                <div>
                  <Checkbox
                    defaultChecked={item?.show}
                    onChange={(e: any) => onChangeCheckbox(item, e, columnTable, setColumnTable)}
                  />
                  <div>{item?.title}</div>
                </div>
              ))
            }
          </div>
        }
        <div className="flex-between-center gap-4 p-4">
          <Input
            placeholder='Tìm kiếm thiết bị'
            allowClear
            value={name}
            onChange={(e: any) => onChangeSearch(e, setName, searchQuery, setSearchQuery, searchQueryString)}
            className="input"
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={equipments}
        className="mt-6 shadow-md"
        expandable={{
          expandedRowRender: (record: any) => <TextArea placeholder='Nhập ghi chú kiểm kê' onChange={(e: any) => onChangeCountSupply(record, e)} rows={2} />,
          rowExpandable: (record) => record?.Inventories?.length > 0 ?
            record?.Inventories[record?.Inventories?.length - 1]?.status !== 0
            : record?.Inventories[0]?.status !== 0,
        }}
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
      <div className='flex gap-4'>
        {
          isDoneInventory ?
            <Button className='button mt-6' loading={loadingDone} onClick={handleDoneInventory}>Hoàn thành kiểm kê</Button>
            : <Button className='button mt-6' loading={loadingConfirm} onClick={handleCreateInventory}>Xác nhận kiểm kê</Button>
        }
      </div>
    </div>
  )
}

export default ListEquipments
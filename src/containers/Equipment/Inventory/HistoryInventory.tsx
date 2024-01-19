import { inventory_status } from 'constants/dataFake.constant';
import useDebounce from 'hooks/useDebounce';
import useQuery from 'hooks/useQuery';
import useSearchName from 'hooks/useSearchName';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ava from 'assets/logo.png';
import { Checkbox, Divider, Input, Pagination, Row, Table } from 'antd';
import equipmentInventoryApi from 'api/equipment_inventory.api';
import ExportToExcel from 'components/Excel';
import { FilterFilled, SelectOutlined } from '@ant-design/icons';
import { onChangeCheckbox } from 'utils/globalFunc.util';
import moment from 'moment';

const limit: number = 10;

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

const HistoryInventory = () => {
  
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
  const [page, setPage] = useState<number>(currentPage || 1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
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
        <div>{item?.Equipment?.Department?.name}</div>
      )
    },
    {
      title: 'Tên thiết bị',
      show: true,
      widthExcel: 30,
      render: (item: any) => (
        <div>{item?.Equipment?.name}</div>
      )
    },
    {
      title: 'Mã hóa thiết bị',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <div>{item?.Equipment?.code}</div>
      )
    },
    {
      title: 'Model',
      show: true,
      widthExcel: 40,
      render: (item: any) => (
        <div>{item?.Equipment?.model}</div>
      )
    },
    {
      title: 'Serial',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <div>{item?.Equipment?.serial}</div>
      )
    },
    {
      title: 'Ngày kiểm kê',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.inventory_date && moment(item?.inventory_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      title: 'Ghi chú',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.note}</>
      )
    },
    {
      title: 'Lần kiểm kê',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.times}</>
      )
    },
    {
      title: 'Trạng thái kiểm kê',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{handleInventoryStatus(item?.status)}</>
      )
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

  const getHistoryInventoryOfDepartment = () => {
    setLoading(true);
    equipmentInventoryApi.getHistoryInventoryOfDepartment({ page, name, department_id: id })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEquipments(data?.equipments?.rows);
          setTotal(data?.equipments?.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getHistoryInventoryOfDepartment();
  }, [nameSearch, page, id])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">LỊCH SỬ KIỂM KÊ</div>
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
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={equipments}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
    </div>
  )
}

export default HistoryInventory
import { ClockCircleFilled, FilterFilled, SelectOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Checkbox, Divider, Input, Pagination, Row, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import useQuery from 'hooks/useQuery';
import useSearchName from 'hooks/useSearchName';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ava from 'assets/logo.png';
import departmentApi from 'api/department.api';
import { onChangeCheckbox } from 'utils/globalFunc.util';

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

const Inventory = () => {
  const { onChangeSearch } = useSearchName();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const currentPage = query?.page;
  const currentName = query?.name;
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const columns: any = [
    {
      title: 'Ảnh đại diện',
      key: 'image',
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
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 30,
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      show: true,
      widthExcel: 40,
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
      show: true,
      widthExcel: 20,
    },
    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <div>
          <Tooltip title='Lịch sử kiểm kê' className='mr-4'>
            <Link to={`/inventories/history/${item.id}`}><ClockCircleFilled /></Link>
          </Tooltip>
          <Tooltip title='Danh sách thiết bị' className='mr-4'>
            <Link to={`/inventories/list_equipments/${item.id}`}><UnorderedListOutlined /></Link>
          </Tooltip>
        </div>
      ),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);

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
    showTotal: (total: number) => `Tổng cộng: ${total} Khoa - Phòng`,
    onChange: onPaginationChange,
  }

  const searchDepartments = () => {
    setLoading(true);
    departmentApi.search({ keyword: nameSearch, page })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setDepartments(data.departments.rows);
          setTotal(data.departments.count);
        }
      })
      .catch()
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    searchDepartments();
  }, [nameSearch, page])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">KIỂM KÊ THIẾT BỊ THEO KHOA PHÒNG</div>
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
            placeholder='Tìm kiếm khoa phòng'
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
        dataSource={departments}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
    </div>
  )
}

export default Inventory
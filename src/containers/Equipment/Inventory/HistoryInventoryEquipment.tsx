import { inventory_status } from 'constants/dataFake.constant';
import useQuery from 'hooks/useQuery';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Checkbox, Divider, Pagination, Row, Table } from 'antd';
import equipmentInventoryApi from 'api/equipment_inventory.api';
import ExportToExcel from 'components/Excel';
import { SelectOutlined } from '@ant-design/icons';
import { onChangeCheckbox } from 'utils/globalFunc.util';
import moment from 'moment';
import equipmentApi from 'api/equipment.api';
import type { ColumnsType } from 'antd/es/table';

const limit: number = 10;
interface DataType {
  key_1: string;
  value_1: string;
  key_2: string;
  value_2: string;
}


const TableFooter = ({
  paginationProps
}: any) => {

  return (
    <Row justify='space-between'>
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  )
}

const HistoryInventoryEquipment = () => {

  const params: any = useParams();
  const { id } = params
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location?.pathname;
  const query = useQuery();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const currentPage = query?.page;
  const [equipments, setEquipments] = useState<any>([]);
  const [page, setPage] = useState<number>(currentPage || 1);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [equipment, setEquipment] = useState<any>({});

  const columns_data: ColumnsType<DataType> = [
    {
      title: 'Trường',
      dataIndex: 'key_1',
      key: 'key_1',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value_1',
      key: 'value_1',
    },
    {
      title: 'Trường',
      dataIndex: 'key_2',
      key: 'key_2',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value_2',
      key: 'value_2',
    }
  ];

  const data: DataType[] = [
    {
      key_1: 'Tên thiết bị',
      value_1: `${equipment?.name}`,
      key_2: 'Loại thiết bị',
      value_2: `${equipment?.Equipment_Type?.name}`,
    },
    {
      key_1: 'Khoa - Phòng',
      value_1: `${equipment?.Department?.name}`,
      key_2: 'Trạng thái',
      value_2: `${equipment?.Equipment_Status?.name}`,
    },
    {
      key_1: 'Model',
      value_1: `${equipment?.model}`,
      key_2: 'Serial',
      value_2: `${equipment?.serial}`,
    },
  ]
  const columns: any = [
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
    {
      title: 'Người phụ trách kiểm kê',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.inventory_create_user?.name}</>
      )
    },
    {
      title: 'Người phê duyệt',
      show: true,
      widthExcel: 20,
      render: (item: any) => (
        <>{item?.inventory_approve_user?.name}</>
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
    onChange: onPaginationChange,
  }

  const getEquipmentInfo = () => {
    equipmentApi.detail(id)
      .then((res: any) => {
        const { success, data } = res?.data;
        if (success) {
          setEquipment(data.equipment);
        }
      })
      .catch()
  }

  useEffect(() => {
    getEquipmentInfo();
  }, [id])

  const getHistoryInventoryOfEquipment = () => {
    setLoading(true);
    equipmentInventoryApi.getHistoryInventoryOfEquipment({ page, equipment_id: id })
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
    getHistoryInventoryOfEquipment();
  }, [page, id])

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">LỊCH SỬ KIỂM KÊ THIẾT BỊ</div>
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
          <div className='title cursor-pointer'>Tùy chọn trường hiển thị</div>
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
      </div>
      <Divider />
      <div>
        <div className='title'>Thông tin thiết bị</div>
        <Table columns={columns_data} dataSource={data} pagination={false} className="mt-6 shadow-md" />
      </div>
      <Divider />
      <div>
        <div className='title'>Thông tin kiểm kê</div>
        <Table
          columns={columnTable.filter((item: any) => item.show)}
          dataSource={equipments}
          className="mt-6 shadow-md"
          footer={() => <TableFooter paginationProps={pagination} />}
          pagination={false}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default HistoryInventoryEquipment
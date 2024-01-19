import { useEffect, useState } from 'react';
import { DeleteFilled, EditFilled, EyeFilled, FilterFilled, PlusCircleFilled, SelectOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Menu, Popconfirm, Row, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import { createUrlWithQueryString, hasAuthority, onChangeCheckbox } from 'utils/globalFunc.util';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import moment from 'moment/moment';
import { TableFooter } from 'components/TableFooter';
import { toast } from 'react-toastify';
import { Pageable } from '../../types/commonResponse.type';
import { GetSupplyQueryParam, SupplyFullInfoDto } from 'types/supply.type';
import { PageableRequest } from '../../types/commonRequest.type';
import { Authority } from '../../constants/authority';
import supplyApi from '../../api/supply.api';
import { EquipmentStatus } from '../../types/equipment.type';
const Supply = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [supplies, setSupplies] = useState<SupplyFullInfoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [getSupplyQueryParam, setGetSupplyQueryParam] = useState<GetSupplyQueryParam>({});
  const keywordSearch = useDebounce(getSupplyQueryParam.keyword as string, 500);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: query.size || 20, page: query.page || 0 });
  const [queryString, setQueryString] = useState<string>(location.search);
  const columns: any = [
    {
      title: 'Tên hiển thị', dataIndex: 'name', key: 'name', show: true, widthExcel: 30,
    },  {
      title: 'Model', dataIndex: 'model', key: 'model', show: true, widthExcel: 30,
    }, {
      title: 'Serial', dataIndex: 'serial', key: 'serial', show: true, widthExcel: 30,
    }, {
      title: ' Mã vật tư', dataIndex: 'hashCode', key: 'hashCode', show: true, widthExcel: 30,
    }, {
      title: ' Đơn vị tính', show: true, widthExcel: 30, render: (item: SupplyFullInfoDto) => (<Row>{item.unit?.name}</Row>),
    }, {
      title: ' Số lượng', dataIndex: 'amount', key: 'amount', show: true, widthExcel: 30,
    }, {
      title: ' Số lượng đã sử dụng', dataIndex: 'amountUsed', key: 'amountUsed', show: true, widthExcel: 30,
    },{
      title: 'Tác vụ', key: 'action', show: true, render: (item: SupplyFullInfoDto) => (<Menu className='flex flex-row items-center'>
        {hasAuthority(Authority.SUPPLY_READ) && <Menu.Item>
          <Tooltip title='Chi tiết vật tư'>
            <Link to={`/supplies/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
        </Menu.Item>}
        {hasAuthority(Authority.SUPPLY_UPDATE) && <Menu.Item key='updateEquipment'>
          <Tooltip title='Cập nhật thiết bị'>
            <Link to={`/supplies/${item.id}/update`}><EditFilled /></Link>
          </Tooltip>
        </Menu.Item>}
        {hasAuthority(Authority.SUPPLY_DELETE) && <Menu.Item>
          <Tooltip title='Xóa'>
            <Popconfirm
              title='Bạn muốn xóa vật tư này?'
              onConfirm={() => handleDeleteSupply(item.id as number)}
              okText='Xóa'
              cancelText='Hủy'
            >
              <DeleteFilled />
            </Popconfirm>
          </Tooltip>
        </Menu.Item>}
      </Menu>),
    },
  ];
  const [columnTable, setColumnTable] = useState<any>(columns);
  const onChangeQueryParams = (key: string, value: string | moment.Moment[] | undefined | number | PageableRequest) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest };
    let getSupplyQueryParamClone: GetSupplyQueryParam = getSupplyQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'keyword') {
      getSupplyQueryParamClone = { ...getSupplyQueryParam, keyword: value as string };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    setGetSupplyQueryParam(getSupplyQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getSupplyQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} vật tư`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });
    },
    showQuickJumper: true,
  };
  const handleDeleteSupply = (id: number) => {
    supplyApi.deleteSupply(id).then(res => {
      toast.success('Vật tư được xoá thành công!');
      onChangeQueryParams('', '');
    });
  };


  const searchListOfSupply = (queryParams: GetSupplyQueryParam, pageableRequest: PageableRequest) => {
    supplyApi.getSupplies(queryParams, pageableRequest).then((res) => {
      if (res.data.success) {
        setSupplies(res.data.data.content);
        setPageable(res.data.data.page);
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setGetSupplyQueryParam({
      keyword: query.keyword || '',
    });
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfSupply(getSupplyQueryParam, pageableRequest);
    setLoading(false);
  }, [componentShouldUpdate, queryString, keywordSearch]);
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>DANH SÁCH VẬT TƯ</div>

    </div>
    <Divider />
    <div className='flex justify-between flex-col'>
      <div
        className='flex flex-row gap-4 items-center mb-4'
        onClick={() => setIsShowCustomTable(!isShowCustomTable)}
      >
        <SelectOutlined />
        <div className='font-medium text-center cursor-pointer text-base'>Tùy chọn trường hiển thị</div>
      </div>
      {isShowCustomTable && <div className='flex flex-row gap-4'>
        {columnTable.length > 0 && columnTable.map((item: any) => (<div>
          <Checkbox
            defaultChecked={item?.show}
            onChange={(e: any) => onChangeCheckbox(item, e, columnTable, setColumnTable)}
          />
          <div>{item?.title}</div>
        </div>))}
      </div>}
      <div className='flex-between-center gap-4 p-4'>
        <Input
          placeholder='Tìm kiếm vật tư'
          allowClear
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            onChangeQueryParams('keyword', e.target.value);
          }}
          className='input'
        />
        <div>
          <FilterFilled />
        </div>
      </div>
    </div>
    <Table
      columns={columnTable.filter((item: any) => item.show)}
      dataSource={supplies}
      className='mt-6 shadow-md'
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      loading={loading}
    />
  </div>);
};

export default Supply;

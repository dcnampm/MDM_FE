import { useContext, useEffect, useState } from 'react';
import { DeleteFilled, EditFilled, EyeFilled, FilterFilled, PlusSquareFilled, SelectOutlined } from '@ant-design/icons';
import { Checkbox, DatePicker, Divider, Input, Menu, Popconfirm, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// @ts-ignore
import image from 'assets/image.png';
import useQuery from 'hooks/useQuery';
import { FilterContext } from 'contexts/filter.context';
import {
  createUrlWithQueryString,
  formatCurrencyVn,
  getDateForRendering,
  getDepartmentOptions,
  getEquipmentCategoryOptions,
  getRiskLevelOptions,
  getStatusesOption,
  hasAuthority,
  onChangeCheckbox,
  options,
} from 'utils/globalFunc.util';
import useSearchName from 'hooks/useSearchName';
import { useTranslation } from 'react-i18next';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { TableFooter } from 'components/TableFooter';
import { Pageable } from '../../../types/commonResponse.type';
import { EquipmentFullInfoDto, EquipmentStatus, GetEquipmentsQueryParam } from '../../../types/equipment.type';
import { Authority } from '../../../constants/authority';
import { PageableRequest } from '../../../types/commonRequest.type';
import { toast } from 'react-toastify';
import equipmentApi from '../../../api/equipment.api';
// import { values } from 'lodash';
import { YEAR_FORMAT } from '../../../constants/dateFormat.constants';
import { CountEquipmentByDepartmentAndStatus } from 'types/statistics.type';


const StatisticEquipment = () => {
  const { t } = useTranslation();
  const { onChangeSearch } = useSearchName();
  const navigate = useNavigate();
  const { departments, equipmentCategories, equipmentGroups, projects, providers } = useContext(FilterContext);
  const [equipments, setEquipments] = useState<EquipmentFullInfoDto[]>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const query = useQuery();
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [getEquipmentsQueryParam, setGetEquipmentsQueryParam] = useState<GetEquipmentsQueryParam>({});
  const keywordSearch = useDebounce(getEquipmentsQueryParam.keyword as string, 500);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: 20, page: 0 });
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<number | undefined>(undefined);
  const [queryString, setQueryString] = useState<string>(location.search);
  const columns: any = [
    {
      title: 'Ảnh đại diện', dataIndex: 'image', key: 'image', show: false, render(item: any) {
        return (<img src={image} alt='logo' className='w-32 h-32' />);
      },
    }, {
      title: 'Mã thiết bị', dataIndex: 'hashCode', key: 'hashCode', show: true,
    }, {
      title: 'Tên thiết bị', dataIndex: 'name', key: 'name', show: true,
    }, {
      title: 'Khoa - Phòng', key: 'room', show: true, render: (item: EquipmentFullInfoDto) => (<div>{item?.department?.name}</div>),
    }, {
      title: 'Model', key: 'model', dataIndex: 'model', show: true,
    }, {
      title: 'Serial', key: 'serial', dataIndex: 'serial', show: true,
    }, {
      title: 'Trạng thái', key: 'status', show: true, render: (item: EquipmentFullInfoDto) => (<div>{t(item.status || '')}</div>),
    }, {
      title: ' Nhóm thiết bị', key: 'type', show: true, render: (item: EquipmentFullInfoDto) => (<div>{item.category?.group?.name}</div>),
    }, {
      title: 'Loại thiết bị', key: 'type', show: true, render: (item: EquipmentFullInfoDto) => (<div>{item.category?.name}</div>),
    }, {
      title: 'Đơn vị tính', key: 'unit', show: true, render: (item: EquipmentFullInfoDto) => (<div>{item.unit?.name}</div>),
    }, 
    // {
    //   title: 'Mức độ rủi ro', key: 'riskLevel', show: true, render: (item: EquipmentFullInfoDto) => (<div>{item?.riskLevel}</div>),
    // }, 
    {
      title: 'Hãng sản xuất', key: 'manufacturer', show: false, dataIndex: 'manufacturer',
    }, {
      title: 'Xuất xứ', key: 'manufacturingCountry', show: false, dataIndex: 'manufacturingCountry',
    }, {
      title: 'Năm sản xuất', key: 'yearOfManufacture', show: false, dataIndex: 'yearOfManufacture',
    }, {
      title: 'Năm sử dụng', key: 'yearInUse', show: true, dataIndex: 'yearInUse',
    }, {
      title: 'Giá trị ban đầu', key: 'initialValue', show: false, dataIndex: 'initialValue',
    }, {
      title: 'Khấu hao hàng năm', key: 'annualDepreciation', show: false, dataIndex: 'annualDepreciation',
    }, {
      title: ' Cấu hình', key: 'configuration', show: false, dataIndex: 'configuration',
    }, {
      title: ' Giá nhập', show: false, render(item: EquipmentFullInfoDto): JSX.Element {return <div>{formatCurrencyVn(item?.importPrice as number)}</div>;},
    }, {
      title: ' Quy trình sử dụng', key: 'usageProcedure', show: false, dataIndex: 'usageProcedure',
    }, {
      title: ' Bảo dưỡng định kỳ',
      show: false,
      render(item: EquipmentFullInfoDto): JSX.Element {return <div>{item?.regularMaintenance ? `${item.regularMaintenance} tháng` : 'Không bắt buộc'}</div>;},
    }, {
      title: ' Kiểm định định kỳ',
      show: false,
      render(item: EquipmentFullInfoDto): JSX.Element {return <div>{item?.regularInspection ? `${item.regularInspection} tháng` : 'Không bắt buộc'}</div>;},
    }, {
      title: ' Ngày hết hạn HĐ LDLK',
      show: false,
      render(item: EquipmentFullInfoDto): JSX.Element {return <div>{getDateForRendering(item.jointVentureContractExpirationDate)}</div>;},
    }, {
      title: ' Ngày hết hạn bảo hành',
      show: false,
      render(item: EquipmentFullInfoDto): JSX.Element {return <div>{getDateForRendering(item.warrantyExpirationDate)}</div>;},
    }, {
      title: ' Dự án', show: false, render(item: EquipmentFullInfoDto): JSX.Element {return <div>{item?.project?.name}</div>;},
    }, {
      title: ' Nhà cung cấp', key: 'supplier', show: false, dataIndex: 'supplier.name',
    }, {
      title: 'Tác vụ', key: 'action', show: true, render: (item: EquipmentFullInfoDto) => (<Menu className='flex flex-row items-center'>
        {/* {item.status === EquipmentStatus.IN_USE && hasAuthority(Authority.EQUIPMENT_READ) && <>
          <Menu.Item key='supplies'>
            <Tooltip title='Nhập vật tư kèm theo'>
              <Popconfirm
                title='Nhập vật tư kèm theo'
                onConfirm={() => navigate(`/equipments/${item?.id}/import_supplies`)}
                onCancel={() => navigate(`/equipments/${item?.id}/import_supply`)}
                okText='Chọn vật tư sẵn có'
                cancelText='Nhập mới'
              >
                <PlusSquareFilled />
              </Popconfirm>
            </Tooltip>
          </Menu.Item>
        </>} */}
        <Menu.Item key='detail'>
          <Tooltip title='Hồ sơ thiết bị'>
            <Link to={`/equipments/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
        </Menu.Item>
        {item.status !== EquipmentStatus.LIQUIDATED && hasAuthority(Authority.EQUIPMENT_UPDATE) && <Menu.Item key='updateEquipment'>
          <Tooltip title='Cập nhật thiết bị'>
            <Link to={`/equipments/${item.id}/update`}><EditFilled /></Link>
          </Tooltip>
        </Menu.Item>}
        <Menu.Item key='delete'>
          <Tooltip title='Xóa thiết bị'>
            <Popconfirm
              title='Bạn muốn xóa thiết bị này?'
              onConfirm={() => {}}
              okText='Xóa'
              cancelText='Hủy'
            >
              <DeleteFilled />
            </Popconfirm>
          </Tooltip>
        </Menu.Item>
      </Menu>),
    },
  ];

  const [columnTable, setColumnTable] = useState<any>(columns);
  const onChangeQueryParams = (key: string, value: string | string[] | undefined | number | PageableRequest | number[]) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest, page: 0 };
    let getEquipmentsQueryParamClone: GetEquipmentsQueryParam = getEquipmentsQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'status') {
      getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, status: value as string };
    }
    if (key === 'groupId') {
      setSelectedEquipmentGroup(isNaN(Number(value)) ? undefined : Number(value));
      getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, groupId: isNaN(Number(value)) ? undefined : Number(value), categoryId: undefined };
    }
    if (key === 'categoryId') {
      getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, categoryId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'departmentId') {
      getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, departmentId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'keyword') {
      getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, keyword: value as string };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    if (key === 'riskLevel') {
      getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, riskLevel: value as string };
    }
    if (key === 'yearInUse') {
      value = value as number[];
      if (value != null && value[0] != null && value[1] != null) {
        getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, yearInUseFrom: value[0], yearInUseTo: value[1] };
      } else {
        getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, yearInUseFrom: undefined, yearInUseTo: undefined };
      }
    }
    if (key === 'yearOfManufacture') {
      value = value as number[];
      if (value != null && value[0] != null && value[1] != null) {
        getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, yearOfManufactureFrom: value[0], yearOfManufactureTo: value[1] };
      } else {
        getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, yearOfManufactureFrom: undefined, yearOfManufactureTo: undefined };
      }
    }
    if (key === 'projectId') {
      getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, projectId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'supplierId') {
      getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, supplierId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'jointVentureContractExpirationDate') {
      value = value as string[];
      if (value != null && value[0] != null && value[1] != null) {
        getEquipmentsQueryParamClone =
          { ...getEquipmentsQueryParam, jointVentureContractExpirationDateFrom: value[0], jointVentureContractExpirationDateTo: value[1] };
      } else {
        getEquipmentsQueryParamClone =
          { ...getEquipmentsQueryParam, jointVentureContractExpirationDateFrom: undefined, jointVentureContractExpirationDateTo: undefined };
      }
    }
    if (key === 'warrantyExpirationDate') {
      value = value as string[];
      if (value != null && value[0] != null && value[1] != null) {
        getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, warrantyExpirationDateFrom: value[0], warrantyExpirationDateTo: value[1] };
      } else {
        getEquipmentsQueryParamClone = { ...getEquipmentsQueryParam, warrantyExpirationDateFrom: undefined, warrantyExpirationDateTo: undefined };
      }
    }
    setGetEquipmentsQueryParam(getEquipmentsQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getEquipmentsQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const pagination: PaginationProps = {
    current: pageable.number as number + 1,
    total: pageable.totalElements,
    pageSize: pageable.size,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: (page, pageSize) => {
      onChangeQueryParams('pageable', { page: page - 1, size: pageSize });

    },
    showQuickJumper: true,
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfEquipment(getEquipmentsQueryParam, pageableRequest);
    // setLoading(false);
  }, [queryString, keywordSearch, componentShouldUpdate]);


  const searchListOfEquipment = (queryParams: GetEquipmentsQueryParam, pageableRequest: PageableRequest) => {
    equipmentApi.statisticEquipments(queryParams, pageableRequest).then((res) => {
      if (res.data.success) {
        setEquipments(res.data.data.content as EquipmentFullInfoDto[]);
        setPageable(res.data.data.page as Pageable);
        setLoading(false);

      }
    }).catch((err) => {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    });
  };

  return (<div>
    <div className='flex-between-center'>
      <div className='title'>DANH SÁCH THIẾT BỊ</div>
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
        <Select
          style={{ width: '400px' }}
          showSearch
          placeholder='Tất cả Trạng thái'
          optionFilterProp='children'
          onChange={(value: any) => onChangeQueryParams('status', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          className='select-custom'
          options={getStatusesOption()}
        />
        <Select
          showSearch
          style={{ width: '500px' }}
          placeholder='Khoa - Phòng'
          optionFilterProp='children'
          onChange={(value: any) => onChangeQueryParams('departmentId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getDepartmentOptions(departments)}
        />
        {/* <Select
          showSearch
          style={{ width: '300px' }}
          placeholder='Mức độ rủi ro'
          optionFilterProp='children'
          onChange={(value: any) => onChangeQueryParams('riskLevel', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getRiskLevelOptions()}
        /> */}

        <Select
          showSearch
          placeholder=' Nhóm thiết bị'
          style={{ width: '600px' }}
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('groupId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(equipmentGroups)}
        />
        <Select
          showSearch
          placeholder='Loại thiết bị'
          style={{ width: '600px' }}
          optionFilterProp='children'
          onChange={(value: any) => onChangeQueryParams('categoryId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getEquipmentCategoryOptions(equipmentCategories, selectedEquipmentGroup as number)}
        />
        <Tooltip
          title='Năm sử dụng' style={{}}>
          <DatePicker.RangePicker
            style={{
              width: '500px',
            }}
            className={'date'}
            picker='year'
            allowClear={true}
            placeholder={['Từ năm', 'Đến năm']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('yearInUse', undefined);
                return;
              }
              onChangeQueryParams('yearInUse', [Number(value[0].format(YEAR_FORMAT)), Number(value[1].format(YEAR_FORMAT))]);
            }}
          />
        </Tooltip>
        <div>
          <FilterFilled />
        </div>
      </div>
      <div className='flex-between-center gap-4 p-4'>
        <Tooltip
          title='Năm sản xuất'>
          <DatePicker.RangePicker
            style={{
              width: '600px',
            }}
            className={'date'}
            picker='year'
            allowClear={true}
            placeholder={['Từ năm', 'Đến năm']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('yearOfManufacture', undefined);
                return;
              }
              onChangeQueryParams('yearOfManufacture', [Number(value[0].format(YEAR_FORMAT)), Number(value[1].format(YEAR_FORMAT))]);
            }}
          />
        </Tooltip>
        <Select
          showSearch
          placeholder='Dự án'
          style={{ width: '500px' }}
          optionFilterProp='children'
          onChange={(value: any) => onChangeQueryParams('projectId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(projects)}
        />
        <Select
          showSearch
          placeholder='Nhà cung cấp'
          style={{ width: '600px' }}
          optionFilterProp='children'
          onChange={(value: any) => onChangeQueryParams('supplierId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(providers)}
        />
        <Tooltip
          title='Hết hạn HĐ LDLK'>
          <DatePicker.RangePicker
            style={{
              width: '700px',
            }}
            className={'date'}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến  ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('jointVentureContractExpirationDate', undefined);
                return;
              }
              onChangeQueryParams('jointVentureContractExpirationDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Tooltip
          title='Hết hạn bảo hành'>
          <DatePicker.RangePicker
            style={{
              width: '700px',
            }}
            className={'date'}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến  ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('warrantyExpirationDate', undefined);
                return;
              }
              onChangeQueryParams('warrantyExpirationDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>

        <Tooltip
          title=' Ngày nhập kho'>
          <DatePicker.RangePicker
            style={{
              width: '700px',
            }}
            className={'date'}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến  ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('wareho', undefined);
                return;
              }
              onChangeQueryParams('warrantyExpirationDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
      </div>
      <div className='flex-between-center gap-4 p-4'>
        <Tooltip
          title=' Kiểm định lần cuối'>
          <DatePicker.RangePicker
            style={{
              width: '700px',
            }}
            className={'date'}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến  ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('warrantyExpirationDate', undefined);
                return;
              }
              onChangeQueryParams('warrantyExpirationDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        {/* <Tooltip
          title=' Kiểm định lần tiếp theo'>
          <DatePicker.RangePicker
            style={{
              width: '700px',
            }}
            className={'date'}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến  ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('warrantyExpirationDate', undefined);
                return;
              }
              onChangeQueryParams('warrantyExpirationDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip> */}
        {/* <Select
          showSearch
          placeholder=' Chu kỳ kiểm định'
          style={{ width: '600px' }}
          optionFilterProp='children'
          onChange={(value: any) => onChangeQueryParams('supplierId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(providers)}
        /> */}
        <Tooltip
          title=' Bảo dưỡng lần cuối'>
          <DatePicker.RangePicker
            style={{
              width: '700px',
            }}
            className={'date'}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến  ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('warrantyExpirationDate', undefined);
                return;
              }
              onChangeQueryParams('warrantyExpirationDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Tooltip
          title=' Bảo dưỡng lần tiếp theo'>
          <DatePicker.RangePicker
            style={{
              width: '700px',
            }}
            className={'date'}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến  ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('warrantyExpirationDate', undefined);
                return;
              }
              onChangeQueryParams('warrantyExpirationDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Select
          showSearch
          placeholder=' Chu kỳ bảo dưỡng'
          style={{ width: '600px' }}
          optionFilterProp='children'
          onChange={(value: any) => onChangeQueryParams('supplierId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(providers)}
        />
      </div>
      <div className='flex-between-center gap-4 p-4'>
        <Input
          placeholder='Tìm kiếm thiết bị theo tên, mã thiết bị, số serial, model, nhà sản xuất, xuất xứ...'
          allowClear
          value={keyword}
          className='input'
          onChange={(e) => onChangeQueryParams('keyword', e.target.value)}
        />
      </div>
    </div>
    <Table
      columns={columnTable.filter((item: any) => item.show)}
      dataSource={equipments}
      className='mt-6 shadow-md table-responsive'
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      loading={loading}
    />
  </div>);
};

export default StatisticEquipment;
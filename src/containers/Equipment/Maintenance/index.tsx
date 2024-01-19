import { useContext, useEffect, useState } from 'react';
import {
  CheckCircleOutlined, EyeFilled, FileExcelFilled, FileWordFilled, FilterFilled, FormOutlined, PlusCircleFilled, ProfileFilled,
} from '@ant-design/icons';
import { Button, DatePicker, Divider, Input, Menu, Select, Table, Tooltip } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FilterContext } from 'contexts/filter.context';
import {
  createUrlWithQueryString,
  getCycleOption,
  getDateForRendering,
  getTheSecondBiggestIdTicket,
  getEquipmentCategoryOptions,
  getBiggestIdTicket,
  getStatusesOption,
  hasAuthority,
  options,
} from 'utils/globalFunc.util';
import equipmentMaintenance from '../../../api/equipment_maintenance.api';
import { GetEquipmentsForMaintenanceQueryParam, MaintenanceTicketFullInfoDto } from '../../../types/maintenance.type';
import useQuery from '../../../hooks/useQuery';
import { PageableRequest } from '../../../types/commonRequest.type';
import { toast } from 'react-toastify';
import { ColumnGroupType } from 'antd/es/table';
import { ColumnType } from 'antd/lib/table';
import { EquipmentListMaintenanceDto, EquipmentStatus } from 'types/equipment.type';
import i18n from 'i18next';
import { Authority } from '../../../constants/authority';
import useDebounce from '../../../hooks/useDebounce';
import { ModalCreateMaintenanceTicket } from '../../../components/ModalCreateMaintenanceTicket';
import ModalAcceptMaintenanceTicket from 'components/ModalAcceptMaintenanceTicket';
import { ISO_DATE_FORMAT } from '../../../constants/dateFormat.constants';
import moment from 'moment';
import { TableFooter } from 'components/TableFooter';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../../types/commonResponse.type';
import { NotificationContext } from '../../../contexts/notification.context';


export interface CreateMaintenanceTicketModalData {
  equipment?: EquipmentListMaintenanceDto;
}

export interface AcceptMaintenanceTicketModalData {
  equipment?: EquipmentListMaintenanceDto;
}

const Maintenance = () => {
  const { departments, equipmentGroups, equipmentCategories } = useContext(FilterContext);
  const columns: (ColumnGroupType<never> | ColumnType<never>)[] = [
    {
      title: 'Mã thiết bị', key: 'hashCode', render: (item: EquipmentListMaintenanceDto) => (<div>{item.hashCode}</div>),
    }, {
      title: 'Tên thiết bị', key: 'name', render: (item: EquipmentListMaintenanceDto) => (<div>{item.name}</div>),
    }, {
      title: 'Trạng thái', key: 'status', render: (item: EquipmentListMaintenanceDto) => (<div>{i18n.t(item.status as string)}</div>),
    }, {
      title: 'Khoa - Phòng', key: 'department', render: (item: EquipmentListMaintenanceDto) => (<div>{item.department?.name}</div>),
    }, {
      title: 'Chu kỳ bảo dưỡng', key: 'regularMaintenance', render: (item: EquipmentListMaintenanceDto) => (<div>{item.regularMaintenance} tháng</div>),
    }, {
      title: 'Ngày bảo dưỡng lần cuối', key: 'maintenanceDate',

      render: (item: EquipmentListMaintenanceDto) => {
        //lấy ra last time của ticket mới nhất, nếu ticket không có last time nghĩa là ticket này chưa được hoàn thành => lấy last time của ticket trước đó
        let maintenanceDate: string = getDateForRendering(getBiggestIdTicket(item.maintenanceTickets)?.maintenanceDate ?
          getBiggestIdTicket(item.maintenanceTickets)?.maintenanceDate : (getTheSecondBiggestIdTicket(item.maintenanceTickets) as MaintenanceTicketFullInfoDto)?.maintenanceDate);
        return (<div>{maintenanceDate}</div>);
      },
    }, {
      title: 'Ngày bảo dưỡng tiếp theo', key: 'nextTime', render: (item: EquipmentListMaintenanceDto) => {
        //lấy ra next time của ticket mới nhất, nếu ticket không có next time nghĩa là ticket này chưa được hoàn thành => lấy next time của ticket trước đó
        let nextTime: string = getDateForRendering(getBiggestIdTicket(item.maintenanceTickets)?.nextTime ?
          getBiggestIdTicket(item.maintenanceTickets)?.nextTime : (getTheSecondBiggestIdTicket(item.maintenanceTickets) as MaintenanceTicketFullInfoDto)?.nextTime);
        return (<div>{nextTime}</div>);
      },
    }, {
      title: 'Tác vụ', key: 'action', render: (item: EquipmentListMaintenanceDto) => (<Menu className='flex flex-row items-center'>
        {item.status === EquipmentStatus.PENDING_ACCEPT_MAINTENANCE && hasAuthority(Authority.MAINTENANCE_ACCEPT) && <Menu.Item key='edit'>
          <Tooltip title='Phê duyệt phiếu đề xuất bảo dưỡng'>
            <CheckCircleOutlined
              onClick={event => {
                showAcceptMaintenanceTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        {item.status === EquipmentStatus.IN_USE && hasAuthority(Authority.MAINTENANCE_CREATE) && <Menu.Item key='word'>
          <Tooltip title='Tạo phiếu đề xuất bảo dưỡng'>
            <PlusCircleFilled
              onClick={() => {
                showCreateMaintenanceTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        {item.status === EquipmentStatus.UNDER_MAINTENANCE && hasAuthority(Authority.MAINTENANCE_UPDATE) && <Menu.Item key='word'>
          <Tooltip title=' Cập nhật tiến độ bảo dưỡng'>
            <FormOutlined
              onClick={() => {
                navigate(`/equipments/${item.id}/maintenances/${getBiggestIdTicket(item.maintenanceTickets)?.id}/update`);
              }} />
          </Tooltip>
        </Menu.Item>}
        <Menu.Item key='detail'>
          <Tooltip title='Hồ sơ thiết bị'>
            <Link to={`/equipments/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
        </Menu.Item>
      </Menu>),
    },
  ];
  const [equipments, setEquipments] = useState<EquipmentListMaintenanceDto[]>([]);
  const [getMaintenanceQueryParam, setGetMaintenanceQueryParam] = useState<GetEquipmentsForMaintenanceQueryParam>({});
  const query = useQuery();
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: 20, page: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateMaintenanceTicketModal, setShowCreateMaintenanceTicketModal] = useState<boolean>(false);
  const [showAcceptMaintenanceTicketModal, setShowAcceptMaintenanceTicketModal] = useState<boolean>(false);
  const [createMaintenanceTicketModalData, setCreateMaintenanceTicketModalData] = useState<CreateMaintenanceTicketModalData>({});
  const [acceptMaintenanceTicketModalData, setAcceptMaintenanceTicketModalData] = useState<AcceptMaintenanceTicketModalData>({});
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [loading, setLoading] = useState<boolean>(false);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const keywordSearch = useDebounce(getMaintenanceQueryParam.keyword as string, 500);
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<number | undefined>(undefined);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);

  const showCreateMaintenanceTicketModalAndRenderData = (item: EquipmentListMaintenanceDto) => {
    setShowCreateMaintenanceTicketModal(true);
    setCreateMaintenanceTicketModalData({ equipment: item });
  };
  const showAcceptMaintenanceTicketModalAndRenderData = (item: EquipmentListMaintenanceDto) => {
    setShowAcceptMaintenanceTicketModal(true);
    setAcceptMaintenanceTicketModalData({ equipment: item });
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
  const onChangeQueryParams = (key: string, value: string | string[] | undefined | number | PageableRequest) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest, page: 0 };
    let getMaintenanceQueryParamClone: GetEquipmentsForMaintenanceQueryParam = getMaintenanceQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'maintenanceDate') {
      if (value == undefined) {
        getMaintenanceQueryParamClone = { ...getMaintenanceQueryParam, maintenanceDateFrom: undefined, maintenanceDateTo: undefined };
      } else {
        getMaintenanceQueryParamClone = // @ts-ignore
          { ...getMaintenanceQueryParam, maintenanceDateFrom: value[0], maintenanceDateTo: value[1] };
      }
    }
    if (key === 'nextTime') {
      if (value == undefined) {
        getMaintenanceQueryParamClone = { ...getMaintenanceQueryParam, nextTimeFrom: undefined, nextTimeTo: undefined };
      } else {
        getMaintenanceQueryParamClone = // @ts-ignore
          { ...getMaintenanceQueryParam, nextTimeFrom: value[0], nextTimeTo: value[1] };
      }
    }
    if (key === 'regularMaintenance') {
      getMaintenanceQueryParamClone = { ...getMaintenanceQueryParam, regularMaintenance: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'status') {
      getMaintenanceQueryParamClone = { ...getMaintenanceQueryParam, equipmentStatus: value as string };
    }
    if (key === 'groupId') {
      setSelectedEquipmentGroup(isNaN(Number(value)) ? undefined : Number(value));
      getMaintenanceQueryParamClone = { ...getMaintenanceQueryParam, groupId: isNaN(Number(value)) ? undefined : Number(value), categoryId: undefined };
    }
    if (key === 'categoryId') {
      getMaintenanceQueryParamClone = { ...getMaintenanceQueryParam, categoryId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'departmentId') {
      getMaintenanceQueryParamClone = { ...getMaintenanceQueryParam, departmentId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'keyword') {
      getMaintenanceQueryParamClone = { ...getMaintenanceQueryParam, keyword: value as string };
    }
    if (key === 'page') {
      pagebaleClone = { ...pageableRequest, page: value as number };
    }
    if (key === 'size') {
      pagebaleClone = { ...pageableRequest, size: value as number };
    }
    setGetMaintenanceQueryParam(getMaintenanceQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getMaintenanceQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const searchListOfMaintenance = (queryParams: GetEquipmentsForMaintenanceQueryParam, pageableRequest: PageableRequest) => {
    equipmentMaintenance.getAllEquipmentForMaintenance(queryParams, pageableRequest).then((res) => {
      if (res.data.success) {
        setEquipments(res.data.data.content as EquipmentListMaintenanceDto[]);
        setPageable(res.data.data.page as Pageable);
        setLoading(false);
      }
    }).catch((err) => {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setPageableRequest({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfMaintenance(getMaintenanceQueryParam, pageableRequest);
    // setLoading(false);
  }, [queryString, keywordSearch, componentShouldUpdate]);
  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
    onChangeQueryParams('keyword', e.target.value);
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>DANH SÁCH THIẾT BỊ CẦN BẢO DƯỠNG, BẢO TRÌ</div>
      <div className='flex flex-row gap-6'>
        {/*<Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
        >
          <FileExcelFilled />
          <div className='font-medium text-md text-[#5B69E6]'>Xuất Excel</div>
        </Button>*/}
      </div>
    </div>
    <Divider />
    <div className='flex justify-between flex-col'>
      <div className='flex justify-between '>
      </div>
      <div className='flex justify-between'>
        <div className='flex-between-center gap-4 p-4'>
          <Tooltip title='Lọc theo thời gian bảo dưỡng lần cuối'>
            <DatePicker.RangePicker
              className={'date'}
              format={ISO_DATE_FORMAT}
              allowClear={true}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={(value) => {
                if (value == null || value[0] == null || value[1] == null) {
                  onChangeQueryParams('maintenanceDate', undefined);
                  return;
                }
                onChangeQueryParams('maintenanceDate', [value[0].toISOString(), value[1].toISOString()]);
              }}
            />
          </Tooltip>
          <Tooltip title='Lọc theo thời gian bảo dưỡng tiếp theo'>
            <DatePicker.RangePicker
              className={'date'}
              format={ISO_DATE_FORMAT}
              allowClear={true}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={(value) => {
                if (value == null || value[0] == null || value[1] == null) {
                  onChangeQueryParams('nextTime', undefined);
                  return;
                }
                onChangeQueryParams('nextTime', [value[0].toISOString(), value[1].toISOString()]);
              }}
            />
          </Tooltip>
          <Select
            showSearch
            placeholder=' Chọn chu kỳ bảo dưỡng'
            optionFilterProp='children'
            onChange={(value: string) => onChangeQueryParams('regularMaintenance', value)}
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={getCycleOption()}
          />
          <Select
            showSearch
            placeholder='Tất cả Trạng thái'
            optionFilterProp='children'
            onChange={(value: string) => onChangeQueryParams('status', value)}
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={getStatusesOption()
              .filter(value => value.value === EquipmentStatus.UNDER_MAINTENANCE || value.value === EquipmentStatus.PENDING_ACCEPT_MAINTENANCE ||
                value.value === EquipmentStatus.IN_USE)}
          />
          <Select
            showSearch
            placeholder='Khoa - Phòng'
            optionFilterProp='children'
            onChange={(value: string) => onChangeQueryParams('departmentId', value)}
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(departments)}
          />
          <Select
            showSearch
            placeholder=' Nhóm thiết bị'
            optionFilterProp='children'
            onChange={(value: string) => onChangeQueryParams('groupId', value)}
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={options(equipmentGroups)}
          />
          <Select
            showSearch
            placeholder='Loại thiết bị'
            optionFilterProp='children'
            onChange={(value: string) => onChangeQueryParams('categoryId', value)}
            allowClear
            filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
            options={getEquipmentCategoryOptions(equipmentCategories, selectedEquipmentGroup as number)}
          />
          <Input
            placeholder='Tìm kiếm thiết bị'
            allowClear
            value={keyword}
            className='input'
            onChange={handleInputChange}
          />
          <FilterFilled />
        </div>
      </div>
    </div>
    <Table
      loading={loading} columns={columns} dataSource={equipments as never[]}
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      className='mt-6 shadow-md table-responsive' />
    <ModalCreateMaintenanceTicket
      showCreateMaintenanceTicketModal={showCreateMaintenanceTicketModal}
      hideCreateMaintenanceTicketModal={() => setShowCreateMaintenanceTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      createMaintenanceTicketModalData={createMaintenanceTicketModalData}
    />

    <ModalAcceptMaintenanceTicket
      showAcceptMaintenanceTicketModal={showAcceptMaintenanceTicketModal}
      hideAcceptMaintenanceTicketModal={() => setShowAcceptMaintenanceTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      acceptMaintenanceTicketModalData={acceptMaintenanceTicketModalData}
    />
  </div>);
};

export default Maintenance;
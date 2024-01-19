import { useContext, useEffect, useState } from 'react';
import { CheckCircleOutlined, EyeFilled, FilterFilled, PlusCircleFilled } from '@ant-design/icons';
import { DatePicker, Divider, Input, Menu, Select, Table, Tooltip } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FilterContext } from 'contexts/filter.context';
import {
  createUrlWithQueryString,
  getDateForRendering,
  getEquipmentCategoryOptions,
  getBiggestIdTicket,
  getLatestTicket_whoseStatusIsPending,
  getStatusOptionForHandover,
  hasAuthority,
  options,
} from 'utils/globalFunc.util';
import equipmentHandoverApi from '../../../api/equipment_handover.api';
import useQuery from '../../../hooks/useQuery';
import { PageableRequest } from '../../../types/commonRequest.type';
import { toast } from 'react-toastify';
import { ColumnGroupType } from 'antd/es/table';
import { ColumnType } from 'antd/lib/table';
import i18n from 'i18next';
import { Authority } from '../../../constants/authority';
import useDebounce from '../../../hooks/useDebounce';
import { ISO_DATE_FORMAT } from '../../../constants/dateFormat.constants';
import { TableFooter } from 'components/TableFooter';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../../types/commonResponse.type';
import { EquipmentListHandoverDto, EquipmentStatus } from 'types/equipment.type';
import { GetEquipmentsForHandoverQueryParam, HandoverTicketFullInfoDto } from '../../../types/handover.type';
import ModalAcceptHandoverTicket from 'components/ModalAcceptHandoverTicket';
import { ModalCreateHandoverTicket } from 'components/ModalCreateHandoverTicket';
import { NotificationContext } from '../../../contexts/notification.context';


export interface CreateHandoverTicketModalData {
  equipment?: EquipmentListHandoverDto;
}

export interface AcceptHandoverTicketModalData {
  equipment?: EquipmentListHandoverDto;
}

const Handover = () => {
  const { departments, equipmentGroups, equipmentCategories } = useContext(FilterContext);
  const columns: (ColumnGroupType<never> | ColumnType<never>)[] = [
    {
      title: 'Mã thiết bị', key: 'hashCode', render: (item: EquipmentListHandoverDto) => (<div>{item.hashCode}</div>),
    }, {
      title: 'Tên thiết bị', key: 'name', render: (item: EquipmentListHandoverDto) => (<div>{item.name}</div>),
    }, {
      title: ' Serial', key: 'serial', render: (item: EquipmentListHandoverDto) => (<div>{item.serial}</div>),
    }, {
      title: 'Model', key: 'model', render: (item: EquipmentListHandoverDto) => (<div>{item.model}</div>),
    }, {
      title: 'Trạng thái', key: 'status', render: (item: EquipmentListHandoverDto) => (<div>{i18n.t(item.status as string)}</div>),
    }, {
      title: 'Khoa - Phòng nhận bàn giao', key: 'department', render: (item: EquipmentListHandoverDto) => {
        const handoverTicket = getLatestTicket_whoseStatusIsPending(item.handoverTickets as HandoverTicketFullInfoDto[]) as HandoverTicketFullInfoDto;
        const handoverDepartmentName = handoverTicket?.department?.name;
        return (<div>{handoverDepartmentName}</div>);
      },
    }, {
      title: 'Ngày bàn giao',

      render: (item: EquipmentListHandoverDto) => {
        const handoverTicket = getLatestTicket_whoseStatusIsPending(item.handoverTickets as HandoverTicketFullInfoDto[]) as HandoverTicketFullInfoDto;
        const handoverDate = getDateForRendering(handoverTicket?.handoverDate as string);
        return (<div>{handoverDate}</div>);
      },
    }, {
      title: 'Tác vụ', key: 'action', render: (item: EquipmentListHandoverDto) => (<Menu className='flex flex-row items-center'>
        {item.status === EquipmentStatus.PENDING_HANDOVER && hasAuthority(Authority.HANDOVER_ACCEPT) && <Menu.Item key='edit'>
          <Tooltip title=' Phê duyệt phiếu yêu cầu bàn giao'>
            <CheckCircleOutlined
              onClick={event => {
                showAcceptHandoverTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        {item.status === EquipmentStatus.NEW && hasAuthority(Authority.HANDOVER_CREATE) && <Menu.Item key='word'>
          <Tooltip title=' Tạo phiếu yêu cầu bàn giao'>
            <PlusCircleFilled
              onClick={() => {
                showCreateHandoverTicketModalAndRenderData(item);
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
  const [equipments, setEquipments] = useState<EquipmentListHandoverDto[]>([]);
  const [getHandoverQueryParam, setGetHandoverQueryParam] = useState<GetEquipmentsForHandoverQueryParam>({});
  const query = useQuery();
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: 20, page: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateHandoverTicketModal, setShowCreateHandoverTicketModal] = useState<boolean>(false);
  const [showAcceptHandoverTicketModal, setShowAcceptHandoverTicketModal] = useState<boolean>(false);
  const [createHandoverTicketModalData, setCreateHandoverTicketModalData] = useState<CreateHandoverTicketModalData>({});
  const [acceptHandoverTicketModalData, setAcceptHandoverTicketModalData] = useState<AcceptHandoverTicketModalData>({});
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [loading, setLoading] = useState<boolean>(false);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const keywordSearch = useDebounce(getHandoverQueryParam.keyword as string, 500);
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<number | undefined>(undefined);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);

  const showCreateHandoverTicketModalAndRenderData = (item: EquipmentListHandoverDto) => {
    setShowCreateHandoverTicketModal(true);
    setCreateHandoverTicketModalData({ equipment: item });
  };
  const showAcceptHandoverTicketModalAndRenderData = (item: EquipmentListHandoverDto) => {
    setShowAcceptHandoverTicketModal(true);
    setAcceptHandoverTicketModalData({ equipment: item });
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
    let getHandoverQueryParamClone: GetEquipmentsForHandoverQueryParam = getHandoverQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'handoverDate') {
      if (value == undefined) {
        getHandoverQueryParamClone = { ...getHandoverQueryParam, handoverDateFrom: undefined, handoverDateTo: undefined };
      } else {
        getHandoverQueryParamClone = // @ts-ignore
          { ...getHandoverQueryParam, handoverDateFrom: value[0], handoverDateTo: value[1] };
      }
    }
    if (key === 'status') {
      getHandoverQueryParamClone = { ...getHandoverQueryParam, equipmentStatus: value as string };
    }
    if (key === 'groupId') {
      setSelectedEquipmentGroup(isNaN(Number(value)) ? undefined : Number(value));
      getHandoverQueryParamClone = { ...getHandoverQueryParam, groupId: isNaN(Number(value)) ? undefined : Number(value), categoryId: undefined };
    }
    if (key === 'categoryId') {
      getHandoverQueryParamClone = { ...getHandoverQueryParam, categoryId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'departmentId') {
      getHandoverQueryParamClone = { ...getHandoverQueryParam, departmentId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'keyword') {
      getHandoverQueryParamClone = { ...getHandoverQueryParam, keyword: value as string };
    }
    if (key === 'pageable') {
      pagebaleClone = { ...pageableRequest, page: (value as PageableRequest).page, size: (value as PageableRequest).size };
    }
    setGetHandoverQueryParam(getHandoverQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getHandoverQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const searchListOfHandover = (queryParams: GetEquipmentsForHandoverQueryParam, pageableRequest: PageableRequest) => {
    equipmentHandoverApi.getAllEquipmentForHandover(queryParams, pageableRequest).then((res) => {
      console.log("handover", res);
      if (res.data.success) {
        setEquipments(res.data.data.content as EquipmentListHandoverDto[]);
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
    searchListOfHandover(getHandoverQueryParam, pageableRequest);
    setLoading(false);
  }, [queryString, keywordSearch, componentShouldUpdate]);
  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
    onChangeQueryParams('keyword', e.target.value);
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'> BÀN GIAO THIẾT BỊ</div>
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
      <div className=''>
      </div>
      <div className='flex-between-center gap-4 p-4'>
        <Tooltip title='Lọc theo thời gian bàn giao'>
          <DatePicker.RangePicker
            className={'date'}
            format={ISO_DATE_FORMAT}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('handoverDate', undefined);
                return;
              }
              onChangeQueryParams('handoverDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Select
          showSearch
          placeholder='Tất cả Trạng thái'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('status', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getStatusOptionForHandover()}
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
    <Table 
      loading={loading} columns={columns} dataSource={equipments as never[]}
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      className='mt-6 shadow-md table-responsive' />
    <ModalCreateHandoverTicket
      showCreateHandoverTicketModal={showCreateHandoverTicketModal}
      hideCreateHandoverTicketModal={() => setShowCreateHandoverTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      createHandoverTicketModalData={createHandoverTicketModalData}
    />

    <ModalAcceptHandoverTicket
      showAcceptHandoverTicketModal={showAcceptHandoverTicketModal}
      hideAcceptHandoverTicketModal={() => setShowAcceptHandoverTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      acceptHandoverTicketModalData={acceptHandoverTicketModalData}
    />
  </div>);
};

export default Handover;

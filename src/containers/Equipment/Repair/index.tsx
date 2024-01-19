import { useContext, useEffect, useState } from 'react';
import { CheckOutlined, EyeFilled, FilterFilled, PlusCircleFilled, RightCircleFilled, ToolFilled } from '@ant-design/icons';
import { Divider, Input, Menu, Select, Table, Tooltip } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FilterContext } from 'contexts/filter.context';
import {
  createUrlWithQueryString,
  getDateForRendering,
  getEquipmentCategoryOptions,
  getBiggestIdTicket,
  getLatestTicket_whoseStatusIsNotRejected,
  getStatusOptionForRepair,
  hasAuthority,
  options, formatCurrencyVn,
} from 'utils/globalFunc.util';
import equipmentRepairApi from '../../../api/equipment_repair.api';
import useQuery from '../../../hooks/useQuery';
import { PageableRequest } from '../../../types/commonRequest.type';
import { toast } from 'react-toastify';
import { ColumnGroupType } from 'antd/es/table';
import { ColumnType } from 'antd/lib/table';
import i18n from 'i18next';
import { Authority } from '../../../constants/authority';
import useDebounce from '../../../hooks/useDebounce';
import moment from 'moment';
import { TableFooter } from 'components/TableFooter';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Pageable } from '../../../types/commonResponse.type';
import { EquipmentListRepairDto, EquipmentStatus } from 'types/equipment.type';
import { NotificationContext } from '../../../contexts/notification.context';
import { GetEquipmentsForRepairQueryParam, RepairStatus, RepairTicketFullInfoDto } from '../../../types/repair.type';
import ModalAcceptRepairTicket from 'components/ModalAcceptRepair/ModalAcceptRepairTicket';
import ModalAcceptanceTesting from '../../../components/ModalAcceptanceTesting';


export interface AcceptRepairTicketModalData {
  equipment?: EquipmentListRepairDto;
}

const Repair = () => {
  const { departments, equipmentGroups, equipmentCategories } = useContext(FilterContext);
  const getRepairTicket = (item: EquipmentListRepairDto): RepairTicketFullInfoDto | undefined => {
    return getLatestTicket_whoseStatusIsNotRejected(item.repairTickets as RepairTicketFullInfoDto[]) as RepairTicketFullInfoDto;
  };
  const columns: (ColumnGroupType<never> | ColumnType<never>)[] = [
    {
      title: 'Mã thiết bị', key: 'hashCode', render: (item: EquipmentListRepairDto) => (<div>{item.hashCode}</div>),
    }, {
      title: 'Tên thiết bị', key: 'name', render: (item: EquipmentListRepairDto) => (<div>{item?.name}</div>),
    },  {
      title: ' Model', key: 'model', dataIndex:'model',
    },  {
      title: 'Serial', key: 'serial',  dataIndex:'serial',
    }, {
      title: 'Khoa - Phòng', key: 'department', render: (item: EquipmentListRepairDto) => {
        return (<div>{item.department?.name}</div>);
      },
    }, {
      title: 'Trạng thái', key: 'status', render: (item: EquipmentListRepairDto) => (<div>{i18n.t(item.status as string)}</div>),
    }, {
      title: 'Mức độ ưu tiên', key: 'priority',

      render: (item: EquipmentListRepairDto) => (<div>{i18n.t(getBiggestIdTicket(item.reportBrokenTickets)?.priority as string)}</div>),
    }, {
      title: 'Ngày báo hỏng', key: 'reportBrokenDate',

      render: (item: EquipmentListRepairDto) => (<>{getDateForRendering(getBiggestIdTicket(item.reportBrokenTickets)?.createdDate)}</>),
    }, {
      title: 'Ngày lên lịch sửa chữa',
      key: 'scheduleRepairDate',
      render: (item: EquipmentListRepairDto) => (<>{getDateForRendering(getRepairTicket(item)?.createdDate)}</>),
    }, {
      title: 'Ngày sửa chữa', key: 'repairDate',

      render: (item: EquipmentListRepairDto) => (<>{getDateForRendering(getRepairTicket(item)?.repairStartDate)}</>),
    }, {
      title: 'Ngày sửa xong', key: 'repairCompletionDate',

      render: (item: EquipmentListRepairDto) => (<>{getDateForRendering(getRepairTicket(item)?.repairEndDate)}</>),
    }, {
      title: 'Chi phí dự kiến', key: 'estimatedRepairCost',

      render: (item: EquipmentListRepairDto) => (<>{formatCurrencyVn(getRepairTicket(item)?.estimatedCost as number)}</>),
    }, {
      title: 'Chi phí thực tế', key: 'actualRepairCost',

      render: (item: EquipmentListRepairDto) => (<>{formatCurrencyVn(getRepairTicket(item)?.actualCost as number)}</>),
    }, {
      title: 'Tác vụ', key: 'action', render: (item: EquipmentListRepairDto) => {
        let repairTicket = getBiggestIdTicket(item.repairTickets);
        return (<Menu className='flex flex-row items-center'>
          {item.status === EquipmentStatus.PENDING_ACCEPT_REPAIR && hasAuthority(Authority.REPAIR_ACCEPT) && <>
            <Menu.Item key='acceptRepair'>
              <Tooltip title=' Phê duyệt phiếu yêu cầu sửa chữa'>
                <CheckOutlined onClick={() => showAcceptRepairTicketModalAndRenderData(item)} />
              </Tooltip>
            </Menu.Item>
          </>}
          {item.status === EquipmentStatus.BROKEN && hasAuthority(Authority.REPAIR_CREATE) && <Menu.Item key='word'>
            <Tooltip title='Tạo phiếu yêu cầu sửa chữa'>
              <Link to={`/equipments/${item.id}/repairs/create-schedule`}><PlusCircleFilled /></Link>
            </Tooltip>
          </Menu.Item>}

          {item.status === EquipmentStatus.REPAIRING && Authority.REPAIR_UPDATE && <Menu.Item key='edit'>
            <Tooltip title='Cập nhật trạng thái sửa chữa'>
              <Link to={`/equipments/${item.id}/repairs/${getBiggestIdTicket(item.repairTickets)?.id}/update-schedule`}><ToolFilled /></Link>
            </Tooltip>
          </Menu.Item>}
          {(repairTicket?.repairStatus === RepairStatus.DONE || repairTicket?.repairStatus === RepairStatus.CAN_NOT_REPAIR) &&
            hasAuthority(Authority.REPAIR_ACCEPTANCE_TESTING) && <Menu.Item>
              <Tooltip title='Nghiệm thu thiết bị'>
                <RightCircleFilled onClick={() => setAcceptanceTestingFields(item)} />
              </Tooltip>
            </Menu.Item>}
          <Menu.Item key='detail'>
            <Tooltip title='Hồ sơ thiết bị'>
              <Link to={`/equipments/${item.id}`}><EyeFilled /></Link>
            </Tooltip>
          </Menu.Item>
        </Menu>);
      },
    },
  ];
  const [equipments, setEquipments] = useState<EquipmentListRepairDto[]>([]);
  const [getRepairQueryParam, setGetRepairQueryParam] = useState<GetEquipmentsForRepairQueryParam>({});
  const query = useQuery();
  const [pageableRequest, setPageableRequest] = useState<PageableRequest>({ size: 20, page: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [queryString, setQueryString] = useState<string>(location.search);
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [loading, setLoading] = useState<boolean>(false);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const keywordSearch = useDebounce(getRepairQueryParam.keyword as string, 500);
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<number | undefined>(undefined);
  const [pageable, setPageable] = useState<Pageable>({ number: 0, size: 20 });
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);
  const [showAcceptRepairTicketModal, setShowAcceptRepairTicketModal] = useState<boolean>(false);
  const [acceptRepairTicketModalData, setAcceptRepairTicketModalData] = useState<AcceptRepairTicketModalData>({});
  const [showAcceptanceTestingModal, setShowAcceptanceTestingModal] = useState<boolean>(false);
  const [equipmentAcceptanceTestingModal, setEquipmentAcceptanceTestingModal] = useState<EquipmentListRepairDto>({});
  const setAcceptanceTestingFields = (item: EquipmentListRepairDto) => {
    setShowAcceptanceTestingModal(true);
    setEquipmentAcceptanceTestingModal(item);
  };

  const showAcceptRepairTicketModalAndRenderData = (item: EquipmentListRepairDto) => {
    setShowAcceptRepairTicketModal(true);
    setAcceptRepairTicketModalData({ equipment: item });
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
  const onChangeQueryParams = (key: string, value: string | moment.Moment[] | undefined | number | PageableRequest) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageableRequest, page: 0 };
    let getRepairQueryParamClone: GetEquipmentsForRepairQueryParam = getRepairQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'status') {
      getRepairQueryParamClone = { ...getRepairQueryParam, equipmentStatus: value as string };
    }
    if (key === 'groupId') {
      setSelectedEquipmentGroup(isNaN(Number(value)) ? undefined : Number(value));
      getRepairQueryParamClone = { ...getRepairQueryParam, groupId: isNaN(Number(value)) ? undefined : Number(value), categoryId: undefined };
    }
    if (key === 'categoryId') {
      getRepairQueryParamClone = { ...getRepairQueryParam, categoryId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'departmentId') {
      getRepairQueryParamClone = { ...getRepairQueryParam, departmentId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'keyword') {
      getRepairQueryParamClone = { ...getRepairQueryParam, keyword: value as string };
    }
    if (key === 'page') {
      pagebaleClone = { ...pageableRequest, page: value as number };
    }
    if (key === 'size') {
      pagebaleClone = { ...pageableRequest, size: value as number };
    }
    setGetRepairQueryParam(getRepairQueryParamClone);
    setPageableRequest(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getRepairQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };

  const searchListOfRepair = (queryParams: GetEquipmentsForRepairQueryParam, pageableRequest: PageableRequest) => {
    equipmentRepairApi.getAllEquipmentForRepair(queryParams, pageableRequest).then((res) => {
      if (res.data.success) {
        setEquipments(res.data.data.content as EquipmentListRepairDto[]);
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
    searchListOfRepair(getRepairQueryParam, pageableRequest);
    // setLoading(false);
  }, [queryString, keywordSearch, componentShouldUpdate]);
  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
    onChangeQueryParams('keyword', e.target.value);
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'> SỬA CHỮA THIẾT BỊ</div>
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
        <Select
          showSearch
          placeholder='Tất cả Trạng thái'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('status', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getStatusOptionForRepair()}
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
    <ModalAcceptanceTesting
      equipment={equipmentAcceptanceTestingModal}
      showAcceptanceTestingModal={showAcceptanceTestingModal}
      setShowAcceptanceTestingModal={() => setShowAcceptanceTestingModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }} />
    <ModalAcceptRepairTicket
      showAcceptRepairTicketModal={showAcceptRepairTicketModal}
      hideAcceptRepairTicketModal={() => setShowAcceptRepairTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      acceptRepairTicketModalData={acceptRepairTicketModalData}
    />
  </div>);
};

export default Repair;

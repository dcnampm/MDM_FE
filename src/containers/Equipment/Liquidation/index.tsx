import { useContext, useEffect, useState } from 'react';
import { CheckCircleOutlined, EyeFilled, FileWordFilled, FilterFilled, PlusCircleFilled } from '@ant-design/icons';
import { DatePicker, Divider, Input, Menu, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { PageableRequest } from '../../../types/commonRequest.type';
import useQuery from '../../../hooks/useQuery';
import {
  createUrlWithQueryString,
  formatCurrencyVn,
  getDateForRendering,
  getEquipmentCategoryOptions,
  getLatestTicket_whoseStatusIsNotRejected,
  getStatusOptionForLiquidation,
  hasAuthority,
  options,
} from '../../../utils/globalFunc.util';
import i18n from 'i18next';
import { Authority } from '../../../constants/authority';
import { ISO_DATE_FORMAT } from '../../../constants/dateFormat.constants';
import { EquipmentListLiquidationDto, EquipmentStatus } from 'types/equipment.type';
import { GetEquipmentsForLiquidationQueryParam, LiquidationTicketFullInfoDto } from '../../../types/equipmentLiquidation.type';
import equipmentLiquidationApi from '../../../api/equipment_liquidation.api';
import { ModalCreateLiquidationTicket } from 'components/ModalCreateLiquidationTicket';
import ModalAcceptLiquidationTicket from 'components/ModalAcceptLiquidationTicket';
import { FilterContext } from '../../../contexts/filter.context';
import { NotificationContext } from '../../../contexts/notification.context';

const { Option } = Select;

interface DataType {
  key: string;
  image: string;
  code: string;
  name: string;
  model: string;
  serial: string;
  status: string;
  room: string;
}

export interface CreateLiquidationTicketModalData {
  equipment?: EquipmentListLiquidationDto;
}

export interface AcceptLiquidationTicketModalData {
  equipment?: EquipmentListLiquidationDto;
}

const Liquidation = () => {
  const columns: ColumnsType<EquipmentListLiquidationDto> = [
    {
      title: 'Mã thiết bị', render: (item: EquipmentListLiquidationDto) => (<div>{item.hashCode}</div>),
    }, {
      title: 'Tên thiết bị', render: (item: EquipmentListLiquidationDto) => (<div>{item.name}</div>),
    }, {
      title: 'Model', render: (item: EquipmentListLiquidationDto) => (<div>{item.model}</div>),
    }, {
      title: 'Serial', render: (item: EquipmentListLiquidationDto) => (<div>{item.serial}</div>),
    }, {
      title: 'Trạng thái', key: 'status', render: (item: EquipmentListLiquidationDto) => (<div>{i18n.t(item.status as string)}</div>),
    }, {
      title: 'Khoa - Phòng', key: 'department', render: (item: EquipmentListLiquidationDto) => (<div>{item.department?.name}</div>),
    }, {
      title: 'Ngày thanh lý', render: (item: EquipmentListLiquidationDto) => {
        const liquidationTicket = getLatestTicket_whoseStatusIsNotRejected(item.liquidationTickets as LiquidationTicketFullInfoDto[]) as LiquidationTicketFullInfoDto;
        const liquidationDate = getDateForRendering(liquidationTicket?.liquidationDate);
        return (<div>{liquidationDate}</div>);
      },
    }, {
      title: ' Giá thanh lý', render: (item: EquipmentListLiquidationDto) => {
        const liquidationTicket = getLatestTicket_whoseStatusIsNotRejected(item.liquidationTickets as LiquidationTicketFullInfoDto[]) as LiquidationTicketFullInfoDto;
        const liquidationPrice = formatCurrencyVn(liquidationTicket?.price as number);
        return (<div>{liquidationPrice}</div>);
      },
    }, {
      title: 'Tác vụ', key: 'action', render: (item: EquipmentListLiquidationDto) => (<Menu className='flex items-center'>
        {item.status === EquipmentStatus.INACTIVE && hasAuthority(Authority.LIQUIDATION_CREATE) && <Menu.Item key='word'>
          <Tooltip title='Tạo phiếu đề xuất thanh lý'>
            <PlusCircleFilled
              onClick={() => {
                showCreateLiquidationTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        {item.status === EquipmentStatus.PENDING_ACCEPT_LIQUIDATION && hasAuthority(Authority.LIQUIDATION_ACCEPT) && <Menu.Item key='edit'>
          <Tooltip title='Phê duyệt phiếu đề xuất thanh lý'>
            <CheckCircleOutlined
              onClick={event => {
                showAcceptLiquidationTicketModalAndRenderData(item);
              }} />
          </Tooltip>
        </Menu.Item>}
        <Menu.Item key='detail'>
          <Tooltip title='Hồ sơ thiết bị'>
            <Link to={`/equipments/${item.id}`}><EyeFilled /></Link>
          </Tooltip>
        </Menu.Item>
        {/*<Menu.Item key='word'>
          <Tooltip title='In phiếu đề nghị thanh lý'>
            <Link to='/'><FileWordFilled /></Link>
          </Tooltip>
        </Menu.Item>*/}

      </Menu>),
    },
  ];
  const { equipmentGroups, equipmentCategories, departments } = useContext(FilterContext);
  const [equipments, setEquipments] = useState<EquipmentListLiquidationDto[]>([]);
  const [getLiquidationQueryParam, setGetLiquidationQueryParam] = useState<GetEquipmentsForLiquidationQueryParam>({});
  const query = useQuery();
  const [pageable, setPageable] = useState<PageableRequest>({ size: 20, page: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [queryString, setQueryString] = useState<string>(location.search);
  const [showCreateLiquidationTicketModal, setShowCreateLiquidationTicketModal] = useState<boolean>(false);
  const [showAcceptLiquidationTicketModal, setShowAcceptLiquidationTicketModal] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>(query.keyword);
  const [loading, setLoading] = useState<boolean>(false);
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);
  const keywordSearch = useDebounce(getLiquidationQueryParam.keyword as string, 500);
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<number | undefined>(undefined);
  const [createLiquidationTicketModalData, setCreateLiquidationTicketModalData] = useState<CreateLiquidationTicketModalData>({});
  const [acceptLiquidationTicketModalData, setAcceptLiquidationTicketModalData] = useState<AcceptLiquidationTicketModalData>({});
  const { increaseCount, getAllNotifications } = useContext(NotificationContext);

  const showCreateLiquidationTicketModalAndRenderData = (item: EquipmentListLiquidationDto) => {
    setShowCreateLiquidationTicketModal(true);
    setCreateLiquidationTicketModalData({ equipment: item });
  };
  const showAcceptLiquidationTicketModalAndRenderData = (item: EquipmentListLiquidationDto) => {
    setShowAcceptLiquidationTicketModal(true);
    setAcceptLiquidationTicketModalData({ equipment: item });
  };

  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
    onChangeQueryParams('keyword', e.target.value);
  };
  const searchListOfLiquidation = (getLiquidationQueryParam: GetEquipmentsForLiquidationQueryParam, pageable: PageableRequest) => {
    equipmentLiquidationApi.getAllEquipmentForLiquidation(getLiquidationQueryParam, pageable).then((res) => {
      if (res.data.success) {
        setEquipments(res.data.data.content as EquipmentListLiquidationDto[]);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    setComponentShouldUpdate(false);
    setPageable({
      page: Number(query.page) || 0, size: Number(query.size) || 20,
    });
    searchListOfLiquidation(getLiquidationQueryParam, pageable);
    // setLoading(false);
  }, [queryString, keywordSearch, componentShouldUpdate]);
  const onChangeQueryParams = (key: string, value: string | string[] | undefined) => {
    let pagebaleClone: PageableRequest;
    pagebaleClone = { ...pageable, page: 0 };
    let getLiquidationQueryParamClone: GetEquipmentsForLiquidationQueryParam = getLiquidationQueryParam;
    if (key === '') { //if key is empty, it means that the component should be updated
      setComponentShouldUpdate(true);
    }
    if (key === 'liquidationDate') {
      if (value == undefined) {
        getLiquidationQueryParamClone = { ...getLiquidationQueryParam, liquidationDateFrom: undefined, liquidationDateTo: undefined };
      } else {
        getLiquidationQueryParamClone = {
          ...getLiquidationQueryParam, liquidationDateFrom: value[0], liquidationDateTo: value[1],
        };
      }
    }
    if (key === 'groupId') {
      setSelectedEquipmentGroup(isNaN(Number(value)) ? undefined : Number(value));
      getLiquidationQueryParamClone = { ...getLiquidationQueryParam, groupId: isNaN(Number(value)) ? undefined : Number(value), categoryId: undefined };
    }
    if (key === 'categoryId') {
      getLiquidationQueryParamClone = { ...getLiquidationQueryParam, categoryId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'status') {
      getLiquidationQueryParamClone = { ...getLiquidationQueryParam, equipmentStatus: value as string };
    }
    if (key === 'departmentId') {
      getLiquidationQueryParamClone = { ...getLiquidationQueryParam, departmentId: isNaN(Number(value)) ? undefined : Number(value) };
    }
    if (key === 'keyword') {
      getLiquidationQueryParamClone = { ...getLiquidationQueryParam, keyword: value as string };
    }
    setGetLiquidationQueryParam(getLiquidationQueryParamClone);
    setPageable(pagebaleClone);
    const url = createUrlWithQueryString(location.pathname, getLiquidationQueryParamClone, pagebaleClone);
    setQueryString(url);
    navigate(url);
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>DANH SÁCH THIẾT BỊ THANH LÝ</div>
      <div className='flex flex-row gap-6'>
      </div>
    </div>
    <Divider />
    <div className='flex justify-between'>
      <div></div>
      <div className='flex-between-center gap-4 p-4'>
        <Tooltip title='Lọc theo thời gian thanh lý'>
          <DatePicker.RangePicker
            className={'date'}
            format={ISO_DATE_FORMAT}
            allowClear={true}
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(value) => {
              if (value == null || value[0] == null || value[1] == null) {
                onChangeQueryParams('liquidationDate', undefined);
                return;
              }
              onChangeQueryParams('liquidationDate', [value[0].toISOString(), value[1].toISOString()]);
            }}
          />
        </Tooltip>
        <Select
          showSearch
          placeholder='Tất cả Trạng thái'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('status', value)}
          allowClear
          options={getStatusOptionForLiquidation()}
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          className='select-custom'
        />
        <Select
          showSearch
          placeholder='Khoa - Phòng'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('departmentId', value)}
          allowClear
          options={options(departments)}
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
        />
        <Select
          showSearch
          placeholder='Nhóm thiết bị'
          optionFilterProp='children'
          onChange={(value: string) => onChangeQueryParams('groupId', value)}
          allowClear
          options={options(equipmentGroups)}
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
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
          className='rounded-lg h-9 border-[#A3ABEB] border-2'
          onChange={handleInputChange}
        />
        <div>
          <FilterFilled />
        </div>
      </div>
    </div>
    <Table columns={columns} dataSource={equipments} className='mt-6 shadow-md table-responsive' loading={loading} />

    <ModalCreateLiquidationTicket
      showCreateLiquidationTicketModal={showCreateLiquidationTicketModal}
      hideCreateLiquidationTicketModal={() => setShowCreateLiquidationTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      createLiquidationTicketModalData={createLiquidationTicketModalData}
    />

    <ModalAcceptLiquidationTicket
      showAcceptLiquidationTicketModal={showAcceptLiquidationTicketModal}
      hideAcceptLiquidationTicketModal={() => setShowAcceptLiquidationTicketModal(false)}
      callback={() => {
        // increaseCount();
        // getAllNotifications();
        onChangeQueryParams('', '');
      }}
      acceptLiquidationTicketModalData={acceptLiquidationTicketModalData}
    />
  </div>);
};

export default Liquidation;

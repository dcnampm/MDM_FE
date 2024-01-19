import { useContext, useEffect, useState } from 'react';
import { DeleteFilled, EditFilled, EyeFilled, FileExcelFilled, FilterFilled, ImportOutlined, PlusSquareFilled, SelectOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Input, Menu, Popconfirm, Select, Table, Tooltip } from 'antd';
import useDebounce from 'hooks/useDebounce';
import './index.css';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

// @ts-ignore
import image from 'assets/image.png';
import equipmentApi from 'api/equipment.api';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import {
  base64ToBlob,
  getCurrentUser,
  getDepartmentOptions, getEquipmentCategoryOptions, getRiskLevelOptions, getStatusesOption, hasAuthority, onChangeCheckbox, options,
} from 'utils/globalFunc.util';
import useSearchName from 'hooks/useSearchName';
import { EquipmentListDto, EquipmentStatus } from '../../../../types/equipment.type';
import { useTranslation } from 'react-i18next';
import { PaginationProps } from 'antd/lib/pagination/Pagination';
import { Authority } from '../../../../constants/authority';
import { TableFooter } from 'components/TableFooter';
import ModalAttachSupply from './ModalAttachSupply';
import FileSaver from 'file-saver';
import {Buffer} from 'buffer';
import { DepartmentFullInfoDto } from 'types/department.type';

const List = () => {
  const { t } = useTranslation();
  const { onChangeSearch } = useSearchName();
  const navigate = useNavigate();
  const { departments, equipmentCategories, equipmentGroups } = useContext(FilterContext);
  const [equipments, setEquipments] = useState<EquipmentListDto[]>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentKeyword = query?.keyword;
  const currentStatus = query?.status;
  const currentGroup = query?.groupId;
  const currentDepartment = query?.departmentId;
  const currentType = query?.categoryId;
  const currentRiskLevel = query?.riskLevel;
  const [page, setPage] = useState<number>(currentPage || 0);
  const [size, setSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>(currentKeyword);
  const keywordSearch = useDebounce(keyword, 500);
  const [status, setStatus] = useState<any>(currentStatus);
  const [group, setGroup] = useState<any>(currentGroup);
  const [department, setDepartment] = useState<any>(currentDepartment);
  const [type, setType] = useState<any>(currentType);
  const [level, setLevel] = useState<any>(currentRiskLevel);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);
  const [showAttachSupplyModal, setShowAttachSupplyModal] = useState<boolean>(false);
  const [equipmentForAttachingSupply, setEquipmentForAttachingSupply] = useState<EquipmentListDto>({});
  const [componentShouldUpdate, setComponentShouldUpdate] = useState<boolean>(false);

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
      title: 'Model', key: 'model', dataIndex: 'model', show: true,
    }, {
      title: 'Serial', key: 'serial', dataIndex: 'serial', show: true,
    }, {
      title: 'Trạng thái', key: 'status', show: true, render: (item: EquipmentListDto) => (<div>{t(item.status || '')}</div>),
    }, {
      title: 'Loại thiết bị', key: 'type', show: true, render: (item: EquipmentListDto) => (<div>{item.category?.name}</div>),
    }, {
      title: 'Đơn vị tính', key: 'unit', show: true, render: (item: EquipmentListDto) => (<div>{item.unit?.name}</div>),
    }, {
      title: 'Khoa - Phòng', key: 'room', show: true, render: (item: EquipmentListDto) => (<div>{item?.department?.name}</div>),
    }, 
    // {
    //   title: 'Mức độ rủi ro', key: 'riskLevel', show: true, render: (item: EquipmentListDto) => (<div>{item?.riskLevel}</div>),
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
      title: 'Tác vụ', key: 'action', show: true, render: (item: EquipmentListDto) => (<Menu className='flex flex-row items-center'>
        {/* {item.status === EquipmentStatus.IN_USE && hasAuthority(Authority.EQUIPMENT_READ) && <>
          <Menu.Item key='supplies'>
            <Tooltip title='Nhập vật tư kèm theo'>
              <PlusSquareFilled onClick={() => {setShowAttachSupplyModal(true);}} />
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
              onConfirm={() => handleDelete(item.id as number)}
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

  const onPaginationChange = (page: number, size: number) => {
    setPage(page);
    setSize(size);
    searchQuery.page = page;
    searchQuery.size = size;
    setSearchQuery(searchQuery);
    searchQueryString = new URLSearchParams(searchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  };

  const pagination: PaginationProps = {
    current: page,
    total: total,
    pageSize: size,
    showTotal: (total: number) => `Tổng cộng: ${total} thiết bị`,
    onChange: onPaginationChange,
    showQuickJumper: true,
  };

  const handleDelete = (id: number) => {
    equipmentApi.delete(id)
      .then((res) => {
        search(keywordSearch, status, type, department, level, group, 1, size);
        toast.success('Xóa thiết bị thành công!');
      })
      .catch(error => {
        toast.error('Xóa thiết bị thất bại!');
        console.log('Error in delete equipment: ', error);
      });
  };

  const search = (keyword: string, status: any, categoryId: any, departmentId: any, riskLevel: any, groupId: number, page: number, size: number) => {
    equipmentApi.getEquipments({ keyword, status, categoryId, departmentId, riskLevel, groupId }, { page: page, size: size, sort: ['id,desc'] }).then(res => {
      if (res.data.success) {
        console.log("data", res);
        console.log("deparment", departments);
        setEquipments(res.data.data.content as EquipmentListDto[]);
        setTotal(res.data.data?.page?.totalElements as number);
        setLoading(false);
      }
    })
    .catch(error => {
      console.log('Error in equipment list when call api getEquipments: ', error);
      toast.error('Lỗi tìm kiếm thiết bị');
    });
  };

  useEffect(() => {
    setLoading(true);
    // setComponentShouldUpdate(false);

    search(keywordSearch, status, type, department, level, group, page, size);
    // setLoading(false);
  }, [keywordSearch, status, type, department, level, group, page, size]);

  const onChangeSelect = (key: string, value: any) => {
    setPage(1);
    if (key === 'status') {
      setStatus(value);
    }
    if (key === 'groupId') {
      setGroup(value);
    }
    if (key === 'categoryId') {
      setType(value);
    }
    if (key === 'departmentId') {
      setDepartment(value);
    }
    if (key === 'riskLevel') {
      setLevel(value);
    }
    delete searchQuery.page;
    let newSearchQuery: any = { ...searchQuery, [`${key}`]: value };
    setSearchQuery(newSearchQuery);
    if (newSearchQuery[`${key}`] === undefined) {
      delete newSearchQuery[`${key}`];
    }
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    if (Object.keys(newSearchQuery)?.length !== 0) {
      navigate(`${pathName}?page=0&${searchQueryString}`);
    } else {
      setPage(0);
      navigate(`${pathName}?page=0`);
    }
  };

  

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  
  const exportExcel = () => {
    equipmentApi.exportExcel()
    .then((res) => {
      const contentDisposition = res.headers["content-disposition"];
      if (contentDisposition) {
        // Extract the filename from the 'Content-Disposition' header using a regular expression
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
  
        if (filenameMatch) {
          const filename = filenameMatch[1];
          console.log('Filename:', filename);
          const contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          const arrayBuffer = base64ToBlob(res.data.data);
          const blob = new Blob([arrayBuffer], {type: contentType});
          FileSaver.saveAs(blob, filename);
        }
      } else {
        // If the 'Content-Disposition' header is not present, you may need to handle this case differently
        console.log('No Content-Disposition header found.');
      }
      
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  return (<div>
    <div className='flex-between-center'>
      <div className='title'>DANH SÁCH THIẾT BỊ</div>
      <div className='flex flex-row gap-6'>
        
        <Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
          onClick={exportExcel}
          >
          <FileExcelFilled />
          <div className='font-medium text-md text-[#5B69E6]'>Xuất Excel</div>
        </Button>
        
        
          
        <Button
          className='flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2'
          onClick={() => navigate('/equipments/excel/import')}
        >
          <ImportOutlined />
          <div className='font-medium text-md text-[#5B69E6]'>Nhập Excel</div>
        </Button>

      </div>
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
          showSearch
          placeholder='Tất cả Trạng thái'
          optionFilterProp='children'
          onChange={(value: any) => onChangeSelect('status', value)}
          onSearch={onSearch}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          className='select-custom'
          options={getStatusesOption()}
          value={status}
        />

      {hasAuthority(Authority.ROLE_ADMIN) || hasAuthority(Authority.ROLE_TPVT) ? 
        <Select
          showSearch
          placeholder='Khoa - Phòng'
          optionFilterProp='children'
          onChange={(value: any) => onChangeSelect('departmentId', value)}
          onSearch={onSearch}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getDepartmentOptions(departments)}
          value={department}
        />
        : <Select
        showSearch
        placeholder='Khoa - Phòng'
        optionFilterProp='children'
        defaultValue={getCurrentUser().department.id}
        disabled
        // onSelect={(value: any) => onChangeSelect('departmentId', getCurrentUser().department.id)}
        // onChange={(value: any) => onChangeSelect('departmentId', value)}
        // // onSearch={onSearch}
        // // allowClear
        filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
        options={getDepartmentOptions(departments)}
        // value={department}
      />
      }
        {/* <Select
          showSearch
          placeholder='Mức độ rủi ro'
          optionFilterProp='children'
          onChange={(value: any) => onChangeSelect('riskLevel', value)}
          onSearch={onSearch}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getRiskLevelOptions()}
          value={level}
        /> */}

        <Select
          showSearch
          placeholder=' Nhóm thiết bị'
          optionFilterProp='children'
          onChange={(value: string) => onChangeSelect('groupId', value)}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={options(equipmentGroups)}
          value={group}
        />
        <Select
          showSearch
          placeholder='Loại thiết bị'
          optionFilterProp='children'
          onChange={(value: any) => onChangeSelect('categoryId', value)}
          onSearch={onSearch}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getEquipmentCategoryOptions(equipmentCategories, group)}
          value={type}
        />
        <Input
          placeholder='Tìm kiếm thiết bị theo tên, mã thiết bị, số serial, model, nhà sản xuất, xuất xứ...'
          allowClear
          value={keyword}
          className='input'
          onChange={(e) => onChangeSearch(e, setKeyword, searchQuery, setSearchQuery, searchQueryString)}
        />
        <div>
          <FilterFilled />
        </div>
      </div>
    </div>
    <div className='table-responsive'>
    <Table
      columns={columnTable.filter((item: any) => item.show)}
      dataSource={equipments}
      className='mt-6 shadow-md ant-table-column'
      footer={() => (<>
        <TableFooter paginationProps={pagination} />
      </>)}
      pagination={false}
      loading={loading}
    />
    </div>
    <ModalAttachSupply
      equipment={equipmentForAttachingSupply}
      showAttachSupplyModal={showAttachSupplyModal}
      hideAttachSupplyModal={() => setShowAttachSupplyModal(false)}
    />
  </div>);
};

export default List;
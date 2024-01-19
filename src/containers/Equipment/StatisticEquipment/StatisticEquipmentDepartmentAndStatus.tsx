import { Column, Pie } from '@ant-design/plots';
import { Card, Divider, Select, Space, Table, Tag } from 'antd';
import equipmentApi from 'api/equipment.api';
import inUse from 'assets/active.png';
import repairing from 'assets/repairing.png';
import inactive from 'assets/inactive.png';
import liquidated from 'assets/liquidated.png';
import news from 'assets/news.png';
import broken from 'assets/broken.png';
import { Key, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CountEquipmentByDepartment, CountEquipmentByDepartmentAndStatus, CountEquipmentByDepartmentAndStatusDto, CountEquipmentByRiskLevel, CountEquipmentByStatus, StatisticDashboard } from 'types/statistics.type';
// import './index.css';
import { EquipmentStatus } from 'types/equipment.type';
import { useTranslation } from 'react-i18next';
import { TableFooter } from 'components/TableFooter';
import { current } from '@reduxjs/toolkit';
import useQuery from 'hooks/useQuery';
import { getDepartmentOptions } from 'utils/globalFunc.util';
import { FilterContext } from 'contexts/filter.context';
import { sortBy } from 'lodash';
import { ColumnType } from 'antd/lib/table';
import ExportToExcel from 'components/Excel';

const { Meta } = Card;

const StatisticEquipmentDepartmentAndStatus = () => {

  const [countEquipmentByDepartmentAndStatus, setCountEquipmentByDepartmentAndStatus] = useState<CountEquipmentByDepartmentAndStatusDto[]>([]);
  const { t } = useTranslation();

  /////
  const query = useQuery();
  // const currentDepartment = query?.departmentId;
  const [department, setDepartment] = useState<any>(undefined);
  const { departments, equipmentCategories, equipmentGroups } = useContext(FilterContext);

  /////



  const count = (departmentId : number) => {
    equipmentApi.statisticEquipmentByDepartmentAndStatus().then((res) => {
      if (res.data.success) {
        const data: CountEquipmentByDepartmentAndStatus[] = res.data.data;
        console.log(data);
        const countEquipmentByDepartmentAndStatus : CountEquipmentByDepartmentAndStatusDto[] = data.map((item) => {
          const map : Map<String, number> = new Map(Object.entries(item.countByEquipmentStatus));
          const item2 : CountEquipmentByDepartmentAndStatusDto = {
            departmentId: item.departmentId,
            departmentName: item.departmentName,
            newCount: map.get(EquipmentStatus.NEW),
            inUseCount: map.get(EquipmentStatus.IN_USE),
            brokenCount: map.get(EquipmentStatus.BROKEN),
            inactiveCount: map.get(EquipmentStatus.INACTIVE),
            repairingCount: map.get(EquipmentStatus.REPAIRING),
            liquidatedCount: map.get(EquipmentStatus.LIQUIDATED),
            count: item.count
          }
          return item2;
        })

        const flag : CountEquipmentByDepartmentAndStatusDto[] = countEquipmentByDepartmentAndStatus;
        setCountEquipmentByDepartmentAndStatus(countEquipmentByDepartmentAndStatus);

        if (departmentId !== undefined) {
          const filterByDepartment : CountEquipmentByDepartmentAndStatusDto[] = flag.filter(item => item.departmentId === departmentId);
          setCountEquipmentByDepartmentAndStatus(filterByDepartment);
        }

      }
       
    
    });
  };


  useEffect(() => {
    count(department);
    // console.log("hello", countEquipmentByDepartmentAndStatus);
  }, [department]);

  
  /////
  let columns: any = [
    // {
    //   title: 'Khoa - Phòng', key: 'room', show: true, render: (item: CountEquipmentByDepartment) => (<div>{item?.departmentName}</div>),
    // }, {
    //   title: 'Tổng số thiết bị', key: 'totalNumbersOfEquipments', show: true, render: (item: CountEquipmentByDepartment) => (<div>{item?.count}</div>),
    // }, 
    // {
    //   title: 'Khoa - Phòng', key: 'room', show: true, render: (item: CountEquipmentByDepartment) => (<div>{item?.departmentName}</div>),
    // },
    {
      title: 'Khoa - Phòng', key: 'room', show: true, dataIndex: 'departmentName'
    },
    
    {
      title: 'Mới', key: 'new', show: true, dataIndex: 'newCount', align: 'right',
      sorter: {
        compare: (a : any, b : any) => a.newCount - b.newCount,
      }
    },
    {
      title: 'Đang sử dụng', key: 'inUse', show: true, dataIndex: 'inUseCount', align: 'right',
      sorter: {
        compare: (a : any, b : any) => a.inUseCount - b.inUseCount,
      }
    },
    {
      title: 'Hỏng', key: 'broken', show: true, dataIndex: 'brokenCount', align: 'right',
      sorter: {
        compare: (a : any, b : any) => a.brokenCount - b.brokenCount,
      }
    },
    {
      title: 'Đang sửa chữa', key: 'repairing', show: true, dataIndex: 'repairingCount', align: 'right',
      sorter: {
        compare: (a : any, b : any) => a.repairingCount - b.repairingCount,
      }
    },
    {
      title: 'Ngừng sử dụng', key: 'inactive', show: true, dataIndex: 'inactiveCount', align: 'right',
      sorter: {
        compare: (a : any, b : any) => a.inactiveCount - b.inactiveCount,
      }
    },
    {
      title: 'Đã thanh lý', key: 'liquidated', show: true, dataIndex: 'liquidatedCount', align: 'right',
      sorter: {
        compare: (a : any, b : any) => a.liquidatedCount - b.liquidatedCount,
      }
    },
    
    {
      title: 'Tổng số thiết bị', key: 'count', show: true, dataIndex: 'count', align: 'right',
      sorter: {
        compare: (a : any, b : any) => a.count - b.count,
      }
    }, 
  ];
  
let nestedColumn : any = [
  , 
  {
   title: 'Trạng thái', key: 'status', show: true, render: (item: CountEquipmentByStatus) => (<div>{t(item.status)}</div>)
 },
 {
   title: 'Số lượng', key: 'count', show: true, render: (item: CountEquipmentByStatus) => (<div>{item.count}</div>)

 },
]

  const onChangeSelect = (key: string, value: any) => {
    if (key === 'departmentId') {
      setDepartment(value);
    }
  }; 
  /////


  const headerName = ['STT', 'Khoa - Phòng', 'Mới', 'Đang sử dụng', 'Hỏng', 'Đang sửa chữa', 'Ngừng sử dụng', 'Đã thanh lý', 'Tổng số thiết bị']

  return (<>
    <div className='title text-center'>Thống kê theo khoa</div>
    <Divider />
    <div>
    <div className='flex flex-between-center'>
      <Select
          style={{width: 200}}
          showSearch
          placeholder='Khoa - Phòng'
          optionFilterProp='children'
          onChange={(value: any) => onChangeSelect('departmentId', value)}
          // onSearch={onSearch}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getDepartmentOptions(departments)}
          value={department}
        />
      <ExportToExcel 
        data={countEquipmentByDepartmentAndStatus} 
        fileName={'Thống kê thiết bị theo khoa và trạng thái'} 
        headerName={headerName} 
        sheetName={''} 
        title={'Thống kê số lượng thiết bị theo khoa và trạng thái'}
      ></ExportToExcel>
    </div>
      <Table
      columns={columns}
      dataSource={countEquipmentByDepartmentAndStatus}
      // rowKey={(record) => record.departmentName}
      // expandable={{
      //   expandedRowRender: (record) => {
      //     return <Table columns={nestedColumn} dataSource={record.countByEquipmentStatus} pagination={false}
      //     footer={() => (<><Space></Space></>)}
      //     >
      //     </Table>
      //   },
      //   rowExpandable: (record) => true,
      // }}
      className='mt-6 shadow-md ant-table-column'
      footer={() => (<>
        {/* <TableFooter paginationProps={pagination} /> */}
      </>)}
      // loading={loading}
      />
    </div>
  </>);
};

export default StatisticEquipmentDepartmentAndStatus;

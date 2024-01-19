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
import { CountEquipmentByCategory, CountEquipmentByGroupAndCategory, CountEquipmentByDepartment, CountEquipmentByDepartmentAndStatus, CountEquipmentByRiskLevel, CountEquipmentByStatus, StatisticDashboard } from 'types/statistics.type';
// import './index.css';
import { EquipmentStatus } from 'types/equipment.type';
import { useTranslation } from 'react-i18next';
import { TableFooter } from 'components/TableFooter';
import { current } from '@reduxjs/toolkit';
import useQuery from 'hooks/useQuery';
import { getDepartmentOptions, getEquipmentCategoryOptions, options } from 'utils/globalFunc.util';
import { FilterContext } from 'contexts/filter.context';
import { sortBy } from 'lodash';
import ExportToExcel from 'components/Excel';

const { Meta } = Card;

const StatisticEquipmentGroup = () => {
  const navigate = useNavigate();
  const [countEquipmentByGroupAndCategory, setCountEquipmentByGroupAndCategory] = useState<CountEquipmentByGroupAndCategory[]>([]);
  const [group, setGroup] = useState<any>(undefined);
  const [category, setCategory] = useState<any>(undefined);
  const { t } = useTranslation();
  const { equipmentCategories, equipmentGroups } = useContext(FilterContext);
  const count = (groupId: number, categoryId: number) => {
    equipmentApi.statisticEquipmentByGroup().then((res) => {
      if (res.data.success) {
        const data : CountEquipmentByGroupAndCategory[] = res.data.data;
        setCountEquipmentByGroupAndCategory(data);

        if (groupId !== undefined) {
          let filterByGroup : CountEquipmentByGroupAndCategory[] = data.filter(item => item.groupId === groupId);
          setCountEquipmentByGroupAndCategory(filterByGroup);
          if (categoryId !== undefined) {
            filterByGroup.forEach(item => {
              const filterByCategory : CountEquipmentByCategory[] =  item.countByCategoryList.filter(item => item.categoryId === categoryId);
              item.countByCategoryList = filterByCategory;
            })
            setCountEquipmentByGroupAndCategory(filterByGroup);
          }
          
        }
      }

      
    });
  };

  


  useEffect(() => {
    count(group, category);
    // console.log("hello", countEquipmentByDepartmentAndStatus);
  }, [group, category]);

  
  /////
  let columns: any = [
    {
      title: 'Nhóm thiết bị', key: 'groupName', show: true, dataIndex: 'groupName',
    },
    {
      title: 'Tổng số thiết bị', key: 'count', show: true, dataIndex: 'count',
    }, 
  ];
  
let nestedColumn : any = [
  , 
  {
   title: 'Loại thiết bị', key: 'categoryName', show: true, render: (item: CountEquipmentByCategory) => (<div>{item.categoryName}</div>)
 },
 {
   title: 'Số lượng', key: 'count', show: true, render: (item: CountEquipmentByCategory) => (<div>{item.count}</div>)
 },
]

  const onChangeSelect = (key: string, value: any) => {
   
    if (key === 'groupId') {
      setGroup(value);
    }
    if (key === 'categoryId') {
      setCategory(value);
    }
  }; 

  
  /////



  return (<>
    <div className='title text-center'>Thống kê thiết bị theo nhóm - loại</div>
    <Divider />
    <div>

      <div className='flex flex-between-center'>
      <div className='flex flex-start gap-6'>
        <Select
          style={{width: 300}}
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
          style={{width: 300}}
          showSearch
          placeholder='Loại thiết bị'
          optionFilterProp='children'
          onChange={(value: any) => onChangeSelect('categoryId', value)}
          // onSearch={onSearch}
          allowClear
          filterOption={(input, option) => (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())}
          options={getEquipmentCategoryOptions(equipmentCategories, group)}
          value={category}
        />
      </div> 
        <ExportToExcel 
          data={countEquipmentByGroupAndCategory} 
          fileName={'Theo nhom loai'} 
          headerName={columns.map((item: any) => item.title)} 
          sheetName={'Theo nhom loai'} 
          title={''}></ExportToExcel>
    </div>
      
      
      <Table
      columns={columns}
      dataSource={countEquipmentByGroupAndCategory}
      rowKey={(record) => record.groupId}
      expandable={{
        expandedRowRender: (record) => {
          return <Table columns={nestedColumn} dataSource={record.countByCategoryList} pagination={false}
          footer={() => (<><Space></Space></>)}
          >
          </Table>
        },
        rowExpandable: (record) => true,
      }}
      className='mt-6 shadow-md ant-table-column'
      footer={() => (<>
        {/* <TableFooter paginationProps={pagination} /> */}
      </>)}
      // loading={loading}
      />
    </div>

   
  </>);
};

export default StatisticEquipmentGroup;

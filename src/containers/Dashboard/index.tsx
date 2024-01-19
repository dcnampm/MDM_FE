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
import { CountEquipmentByDepartment, CountEquipmentByDepartmentAndStatus, CountEquipmentByRiskLevel, CountEquipmentByStatus, StatisticDashboard } from 'types/statistics.type';
import './index.css';
import { EquipmentStatus } from '../../types/equipment.type';
import { useTranslation } from 'react-i18next';
import { TableFooter } from 'components/TableFooter';
import { current } from '@reduxjs/toolkit';
import useQuery from 'hooks/useQuery';
import { getDepartmentOptions } from 'utils/globalFunc.util';
import { FilterContext } from 'contexts/filter.context';
import { sortBy } from 'lodash';

const { Meta } = Card;

const Dashboard = () => {
  const navigate = useNavigate();
  const [countEquipmentByStatuses, setCountEquipmentByStatuses] = useState<CountEquipmentByStatus[]>([]);
  const [countEquipmentByDepartments, setCountEquipmentByDepartments] = useState<CountEquipmentByDepartment[]>([]);
  const [countEquipmentByRiskLevels, setCountEquipmentByRiskLevels] = useState<CountEquipmentByRiskLevel[]>([]);
  const [countBrokenEquipmentByDepartments, setCountBrokenEquipmentByDepartments] = useState<CountEquipmentByDepartment[]>([]);
  const [sumBrokenEquipments, setSumBrokenEquipments] = useState<number>(0);
  const [countRepairingEquipmentByDepartments, setCountRepairingEquipmentByDepartments] = useState<CountEquipmentByDepartment[]>([]);
  const [sumRepairingEquipments, setSumRepairingEquipments] = useState<number>(0);
  const [countEquipmentByDepartmentAndStatus, setCountEquipmentByDepartmentAndStatus] = useState<CountEquipmentByDepartment[]>([]);
  const { t } = useTranslation();

  /////
  const query = useQuery();
  // const currentDepartment = query?.departmentId;
  const [department, setDepartment] = useState<any>(null);
  const { departments, equipmentCategories, equipmentGroups } = useContext(FilterContext);

  /////



  const count = (departmentId : number) => {
    equipmentApi.statisticDashboard().then((res) => {
      if (res.data.success) {
        const data: StatisticDashboard = res.data.data;
        setCountEquipmentByDepartments(data.countByDepartment);
        setCountEquipmentByRiskLevels(data.countByRiskLevels);
        let countEquipmentByStatuses = data.countByEquipmentStatuses.map((item: CountEquipmentByStatus) => {
          switch (item.status) {
            case EquipmentStatus.NEW:
              item.image = news;
              break;
            case EquipmentStatus.IN_USE:
              item.image = inUse;
              break;
            case EquipmentStatus.BROKEN:
              item.image = broken;
              break;
            case EquipmentStatus.REPAIRING:
              item.image = repairing;
              break;
            case EquipmentStatus.INACTIVE:
              item.image = inactive;
              break;
            case EquipmentStatus.LIQUIDATED:
              item.image = liquidated;
              break;
          }
          return item;
        });
        setCountEquipmentByStatuses(countEquipmentByStatuses);
        setCountBrokenEquipmentByDepartments(data.countBrokenByDepartment);
        setCountRepairingEquipmentByDepartments(data.countRepairingByDepartment);
        let sumBroken = data?.countBrokenByDepartment?.reduce(function(acc: number, obj: CountEquipmentByDepartment) {
          return acc + obj.count;
        }, 0);
        setSumBrokenEquipments(sumBroken);
        let sumRepair = data?.countRepairingByDepartment?.reduce(function(acc: number, obj: CountEquipmentByDepartment) {
          return acc + obj.count;
        }, 0);
        setSumRepairingEquipments(sumRepair);

        const flag : CountEquipmentByDepartment[] = data.countEquipmentByDepartmentAndStatus.sort((a,b) => a.departmentId - b.departmentId);
        setCountEquipmentByDepartmentAndStatus(data.countEquipmentByDepartmentAndStatus);

        if (departmentId !== undefined && departmentId !== null) {
          const count : CountEquipmentByDepartment[] = flag.filter(item => item.departmentId === departmentId);
          setCountEquipmentByDepartmentAndStatus(count);
        }

        // const countEquipmentByDepartmentAndStatus : CountEquipmentByDepartmentAndStatus[] = data.countByDepartment.map((item : CountEquipmentByDepartment) => {
        //   let newCount, inUseCount, brokenCount, repairingCount, inactiveCount, liquidatedCount;
        //   const array : CountEquipmentByStatus[] = item.countByEquipmentStatuses;
        //   array.forEach((item2 : CountEquipmentByStatus) => {
        //     switch (item2.status) {
        //       case EquipmentStatus.NEW:
        //         newCount = item2.count;
        //         break;
        //       case EquipmentStatus.IN_USE:
        //         inUseCount = item2.count;
        //         break;
        //       case EquipmentStatus.BROKEN:
        //         brokenCount = item2.count;
        //         break;
        //       case EquipmentStatus.REPAIRING:
        //         repairingCount = item2.count;
        //         break;
        //       case EquipmentStatus.INACTIVE:
        //         inactiveCount = item2.count;
        //         break;
        //       case EquipmentStatus.LIQUIDATED:
        //         liquidatedCount = item2.count;
        //         break;
        //     }
        //   });
        //   const i : CountEquipmentByDepartmentAndStatus = {
        //     departmentId: item.departmentId,
        //     departmentName: item.departmentName,
        //     count: item.count,
        //     newCount: newCount,
        //     inUseCount: inUseCount,
        //     brokenCount:brokenCount,
        //     inactiveCount: inactiveCount,
        //     repairingCount: repairingCount,
        //     liquidatedCount: liquidatedCount
        //   }
        //   return i;
        // }
        // );
        // const flag : CountEquipmentByDepartmentAndStatus[] = countEquipmentByDepartmentAndStatus;
        // setCountEquipmentByDepartmentAndStatus(countEquipmentByDepartmentAndStatus);
        
        // console.log("before" , flag);
        // console.log(departmentId);
        // if (departmentId !== undefined && department !== null) {
        //   // console.log("h1" , countEquipmentByDepartmentAndStatus);
        //   const count : CountEquipmentByDepartmentAndStatus[] = flag.filter(item => item.departmentId === departmentId);
        //   console.log("after", flag);
        // setCountEquipmentByDepartmentAndStatus(count);
        }
      // }
     
    
    });
  };


  useEffect(() => {
    count(department);
    // console.log("hello", countEquipmentByDepartmentAndStatus);
  }, [department]);

  const dataCountEquipmentByDepartment = countEquipmentByDepartments.length > 0 ? countEquipmentByDepartments : [];
  const configCountEquipmentByDepartment: any = {
    data: dataCountEquipmentByDepartment, xField: 'departmentName', yField: 'count', label: {
      position: 'middle', style: {
        fill: '#FFFFFF', opacity: 0.6,
      },
    }, xAxis: {
      label: {
        autoHide: false, autoRotate: true,
      },
    }, meta: {
      departmentName: {
        alias: 'name',
      }, count: {
        alias: 'Số lượng thiết bị',
      },
    },
  };

  const dataCountEquipmentByRiskLevel = countEquipmentByRiskLevels?.length > 0 ? countEquipmentByRiskLevels : [];
  const configCountEquipmentByRiskLevel: any = {
    appendPadding: 10, data: dataCountEquipmentByRiskLevel, angleField: 'count', colorField: 'riskLevel', radius: 0.9, label: {
      type: 'inner', offset: '-30%', style: {
        fontSize: 14, textAlign: 'center',
      },
    }, interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const dataCountBrokenEquipmentByDepartments = countBrokenEquipmentByDepartments?.length > 0 ? countBrokenEquipmentByDepartments : [];
  const configCountBrokenEquipmentByDepartments: any = {
    appendPadding: 10, data: dataCountBrokenEquipmentByDepartments, angleField: 'count', colorField: 'departmentName', radius: 0.9, label: {
      type: 'inner', offset: '-30%', style: {
        fontSize: 14, textAlign: 'center',
      },
    }, interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const dataCountRepairEquipmentByDepartments = countRepairingEquipmentByDepartments?.length > 0 ? countRepairingEquipmentByDepartments : [];
  const configCountRepairEquipmentByDepartments: any = {
    appendPadding: 10, data: dataCountRepairEquipmentByDepartments, angleField: 'count', colorField: 'departmentName', radius: 0.9, label: {
      type: 'inner', offset: '-30%', style: {
        fontSize: 14, textAlign: 'center',
      },
    }, interactions: [
      {
        type: 'element-active',
      },
    ],
  };

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
      title: 'Khoa - Phòng', key: 'room', show: true, dataIndex: 'departmentName',
    },
    {
      title: 'Tổng số thiết bị', key: 'count', show: true, dataIndex: 'count',
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



  return (<>
    <div className='title text-center'>DASHBOARD</div>
    <Divider />
    <div>
      <div className='mb-8'>
        <div className='title mb-6'>Thống kê thiết bị theo trạng thái</div>
        <div className='grid grid-cols-6'>
          {countEquipmentByStatuses?.length > 0 && countEquipmentByStatuses.map((item: CountEquipmentByStatus) => (<Card
            hoverable
            style={{ width: 180 }}
            cover={<img alt='status' src={item.image} />}
            className='count'
            onClick={() => navigate(`equipments?status=${item.status}`)}
          >
            <Meta
              title={t(item.status)}
              description={`${item.count} thiết bị`}
            />
          </Card>))}
        </div>
      </div>
      <div className='mb-8'>
        <div className='title mb-6'>Thống kê thiết bị theo khoa phòng</div>
        <Card title='Biểu đồ thống kê' hoverable>
          <Column
            {...configCountEquipmentByDepartment}
            onReady={(plot) => {
              plot.on('plot:click', (evt: any) => {
                const data = evt?.data?.data as CountEquipmentByDepartment;
                navigate(`/equipments?departmentId=${data.departmentId}`);
              });
            }}
          />
        </Card>
      </div>
      <div className='mb-8'>
        <div className='title mb-6'>
          Thống kê thiết bị đang báo hỏng ({sumBrokenEquipments} thiết bị)
        </div>
        <Pie
          {...configCountBrokenEquipmentByDepartments}
          onReady={(plot) => {
            plot.on('plot:click', (evt: any) => {
              const data : CountEquipmentByDepartment = evt?.data?.data;
              navigate(`/equipments?status=${EquipmentStatus.BROKEN}&departmentId=${data.departmentId}`);
            });
          }}
        />
      </div>
      <div className='mb-8'>
        <div className='title mb-6'>
          Thống kê thiết bị đang sửa chữa ({sumRepairingEquipments} thiết bị)
        </div>
        <Pie
          {...configCountRepairEquipmentByDepartments}
          onReady={(plot) => {
            plot.on('plot:click', (evt: any) => {
              const data : CountEquipmentByDepartment= evt?.data?.data;
              navigate(`/equipments?status=${EquipmentStatus.REPAIRING}&departmentId=${data.departmentId}`);
            });
          }}
        />
      </div>
      {/* <div className='mb-8'>
        <div className='title mb-6'>Thống kê thiết bị theo mức độ rủi ro</div>
        <Pie
          {...configCountEquipmentByRiskLevel}
          onReady={(plot) => {
            plot.on('plot:click', (evt: any) => {
              const data = evt?.data?.data as CountEquipmentByRiskLevel;
              navigate(`/equipments?riskLevel=${data.riskLevel}`);
            });
          }}
        />
      </div> */}


      
    </div>
  </>);
};

export default Dashboard;

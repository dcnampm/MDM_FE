import { useEffect, useState } from 'react';
import { Divider, Table } from 'antd';
import { useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import supplyApi from 'api/supply.api';
import { SupplyFullInfoDto } from '../../types/supply.type';
import { getDateForRendering } from '../../utils/globalFunc.util';

interface DataType {
  key_1: string;
  value_1: string;
  key_2: string;
  value_2: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Trường', dataIndex: 'key_1', key: 'key_1',
  }, {
    title: 'Giá trị', dataIndex: 'value_1', key: 'value_1',
  }, {
    title: 'Trường', dataIndex: 'key_2', key: 'key_2',
  }, {
    title: 'Giá trị', dataIndex: 'value_2', key: 'value_2',
  },
];
const SupplyDetail = () => {

  const params = useParams();
  const { supplyId } = params;
  const [supply, setSupply] = useState<SupplyFullInfoDto>({});
  useEffect(() => {
    supplyApi.getSupplyById(Number(supplyId)).then((res) => {
      setSupply(res.data.data);
    });
  }, [supplyId]);

  const generatorPDF = () => {
    const element: any = document.getElementById('detail');
    console.log('element', element);
  };

  const data: DataType[] = [
    {
      key_1: 'Giá nhập', value_1: `${supply?.importPrice}` || '', key_2: 'Loại vật tư', value_2: `${supply?.category?.name}`,
    }, {
      key_1: 'Mức độ rủi ro', value_1: `${supply?.riskLevel}`, key_2: 'Đơn vị tính', value_2: `${supply.unit?.name}`,
    }, {
      key_1: 'Năm sản xuất', value_1: `${supply?.yearOfManufacture}`, key_2: 'Năm sử dụng', value_2: `${supply?.yearInUse}`,
    }, {
      key_1: 'Hãng sản xuất', value_1: `${supply?.manufacturer}`, key_2: 'Quốc gia', value_2: `${supply?.manufacturingCountry}`,
    }, {
      key_1: 'Ngày nhập kho',
      value_1: `${getDateForRendering(supply?.warehouseImportDate)}`,
      key_2: 'Ngày hết hạn bảo hành',
      value_2: `${getDateForRendering(supply.expiryDate)}`,
    },

  ];

  return (<div>
    <div className='flex-between-center'>
      <div className='font-medium text-lg'>HỒ SƠ VẬT TƯ</div>
    </div>
    <Divider />
    <div id='detail' className=''>
      <div className='flex flex-row gap-6 my-8'>
        {/* <div className='flex flex-col gap-4 items-center basis-1/3'>
            <Image
              src={supply?.image || image}
              width={300}
            />
            <div>Ảnh vật tư</div>
          </div>*/}
        <div className='basis-2/3'>
          <div className='font-bold text-2xl'>{supply?.name}</div>
          <div className='mt-4'>
            <Table columns={columns} dataSource={data} pagination={false} className='shadow-md' />
          </div>
        </div>
      </div>
    </div>
  </div>);
};

export default SupplyDetail;
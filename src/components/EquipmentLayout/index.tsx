import React from 'react';
import { Button, Divider, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ButtonType {
  icon: any,
  name: string
}

interface SelectType {
  placeHoder: string;
  key: string;
}

interface EquipmentLayoutProps {
  title: string;
  buttons: Array<ButtonType>[];
  selects: Array<SelectType>[];
  columns: ColumnsType<object[]>;
  dataSource: Array<object>[];
}

const EquipmentLaypout = ({
  title, buttons, selects, columns, dataSource,
}: EquipmentLayoutProps) => {
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">{title}</div>
        <div className='flex flex-row gap-6'>
          {
            buttons?.map((button: any) => (
              <Button
                className="flex-center text-slate-900 gap-2 rounded-3xl border-[#5B69E6] border-2"
              >
                {button?.icon}
                <div className="font-medium text-md text-[#5B69E6]">{button?.name}</div>
              </Button>
            ))
          }
        </div>
      </div>
      <Divider />
      <div className="flex justify-between">
        <div></div>
        <div className="flex-between-center gap-4 p-4">
          {
            selects.map((select: any) => (
              <Select
                showSearch
                placeholder={select.placeHoder}
                optionFilterProp="children"
                // onChange={(value: string) => onChange('status', value)}
                // onSearch={onSearch}
                allowClear
                filterOption={(input, option) =>
                  (option!.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                className="select-custom"
              >

              </Select>
            ))
          }
        </div>
      </div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  )
}

export default EquipmentLaypout
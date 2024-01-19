import type { CheckboxOptionType } from 'antd';
import { Button, Checkbox, Collapse, Divider, Form, Input } from 'antd';
import { PERMISSIONS, UpsertRoleForm } from '../../../types/role.type';
import roleApi from '../../../api/role.api';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useNavigate } from 'react-router-dom';


export const CreateRole = () => {


  const [form] = Form.useForm<UpsertRoleForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const [listOfCheckedButton, setListOfCheckedButton] = useState<CheckboxValueType[]>([]);
  const [listOfCheckAllButton, setListOfCheckAllButton] = useState<string[]>([]);
  const [listOfIndeterminateButton, setListOfIndeterminateButton] = useState<string[]>([]);
  const [ultimateCheckAllButton, setUltimateCheckAllButton] = useState<boolean>(false);
  const navigate = useNavigate();
  const onClickSubItem = (list: CheckboxValueType[], index: number) => {
    const permissionGroup = PERMISSIONS[index][1] as string;
    const options = PERMISSIONS[index][2] as CheckboxOptionType[];

    uncheckButton(list, permissionGroup);
    //if list length == options length, add this checkAll button to listOfCheckAllButton
    //remove from listOfIndeterminateButton
    if (list.length === options.length) {
      setListOfCheckAllButton([...listOfCheckAllButton, permissionGroup]);
      setListOfIndeterminateButton(listOfIndeterminateButton.filter(item => item !== permissionGroup));
      return;
    }
    //if list length == 0, remove this checkAll button from listOfCheckAllButton
    //remove from listOfIndeterminateButton
    if (list.length === 0) {
      setListOfCheckAllButton(listOfCheckAllButton.filter(item => item !== permissionGroup));
      setListOfIndeterminateButton(listOfCheckAllButton.filter(item => item !== permissionGroup));
      return;
    }
    //if list length > 0 and < options length, add this checkAll button to listOfIndeterminateButton
    //remove from listOfCheckAllButton
    if (list.length > 0 && list.length < options.length) {
      setListOfCheckAllButton(listOfCheckAllButton.filter(item => item !== permissionGroup));
      setListOfIndeterminateButton([...listOfIndeterminateButton, permissionGroup]);
      return;
    }
  };
  const addAllCheckedButtonToListOfCheckedButton = (list: CheckboxValueType[]) => {
    setListOfCheckedButton([...listOfCheckedButton, ...list]);
  };
  const uncheckButton = (list: CheckboxValueType[], permissionGroup: string) => {
    let newListOfCheckedButton = listOfCheckedButton.filter(item => item.toString().split('.')[0] !== permissionGroup);
    newListOfCheckedButton = [...newListOfCheckedButton, ...list];
    setListOfCheckedButton(newListOfCheckedButton);
  };
  const removeAllCheckedButtonThatHasPermissionGroup = (permissionGroup: string) => {
    setListOfCheckedButton(listOfCheckedButton.filter(item => item.toString().split('.')[0] !== permissionGroup));
  };
  const onClickCheckAllButton = (e: CheckboxChangeEvent, index: number) => {
    const options = PERMISSIONS[index][2] as CheckboxOptionType[];
    const checkboxValueTypes = (options).map((item: CheckboxOptionType) => item.value);
    const permissionGroup = PERMISSIONS[index][1] as string;

    //check all button is already checked
    //uncheck all the item and that button
    if (listOfCheckAllButton.includes(permissionGroup)) {
      removeAllCheckedButtonThatHasPermissionGroup(permissionGroup);
      setListOfCheckAllButton(listOfCheckAllButton.filter(item => item !== permissionGroup));
      return;
    }
    //button is in indeterminate state
    //uncheck all the sub item and then check all, remove the button from indeterminate list
    if (listOfIndeterminateButton.includes(permissionGroup)) {
      removeAllCheckedButtonThatHasPermissionGroup(permissionGroup);
      addAllCheckedButtonToListOfCheckedButton(checkboxValueTypes);
      setListOfIndeterminateButton(listOfIndeterminateButton.filter(item => item !== permissionGroup));
      setListOfCheckAllButton([...listOfCheckAllButton, permissionGroup]);
      return;
    }
    //all the sub item is not checked
    // all the sub item and then add the button to check all list
    addAllCheckedButtonToListOfCheckedButton(checkboxValueTypes);
    setListOfCheckAllButton([...listOfCheckAllButton, permissionGroup]);
  };
  const onCheckUltimateCheckAllButton = () => {
    if (ultimateCheckAllButton) {
      setListOfCheckedButton([]);
      setListOfCheckAllButton([]);
      setListOfIndeterminateButton([]);
      setUltimateCheckAllButton(false);
      return;
    }
    setUltimateCheckAllButton(true);
    setListOfCheckedButton(PERMISSIONS.map(item => item[2]).flat() as CheckboxValueType[]);
    setListOfIndeterminateButton([]);
    setListOfCheckAllButton(PERMISSIONS.map(item => item[1]) as string[]);
  }
  const renderCollapsibleScopeAssignment = () => {
    let collapsibleScopeAssignment: JSX.Element[] = [];
    for (let loopIndex = 0; loopIndex < PERMISSIONS.length; loopIndex++) {
      const header = PERMISSIONS[loopIndex][0] as string;
      const options = PERMISSIONS[loopIndex][2] as CheckboxOptionType[];
      const permissionGroup = PERMISSIONS[loopIndex][1] as string;
      collapsibleScopeAssignment.push(<Collapse.Panel header={header} key={permissionGroup}>
        <div className='flex-between-center'>
          <div>
            <Checkbox.Group
              options={options} value={listOfCheckedButton} onChange={checkedValue => {
              onClickSubItem(checkedValue as CheckboxValueType[], loopIndex);
            }} />
          </div>
          <div>
            <Checkbox
              indeterminate={listOfIndeterminateButton.includes(permissionGroup)}
              onChange={e => onClickCheckAllButton(e, loopIndex)}
              checked={listOfCheckAllButton.includes(permissionGroup)}>
              Tất cả
            </Checkbox>
          </div>
        </div>
      </Collapse.Panel>);
    }
    return (<Collapse defaultActiveKey={PERMISSIONS.map(value => value[1] as string)}>
      {collapsibleScopeAssignment}
    </Collapse>);
  };
  const createRole = (values: UpsertRoleForm) => {
    setLoading(true);
    values = { ...values, permissions: listOfCheckedButton.map(item => item.toString()) };
    roleApi.createRole(values).then((res) => {
      toast.success('Tạo chức vụ thành công');
      navigate('/setting/roles');
    }).finally(() => {
      setLoading(false);
    });
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>TẠO CHỨC VỤ</div>
    </div>
    <Divider />
    <div className='grid grid-cols-3 gap-5'>

      <Form form={form} layout='vertical' size='large' onFinish={createRole}>

        <div className='col-span-1'>
          <Form.Item
            label='Tên chức vụ' name='name' required={true} rules={[
            { required: true, message: 'Vui lòng nhập tên vai trò' },
          ]}>
            <Input className='input' />
          </Form.Item>
          <Form.Item
            label=' Mô tả' name='description'>
            <Input className='input' />
          </Form.Item>
          <div className='flex flex-row justify-end gap-4'>
            <Form.Item>
              <Button htmlType='submit' className='button' loading={loading}>Xác nhận</Button>
            </Form.Item>
          </div>
        </div>
      </Form>
      <div className='col-span-2'>
        <div className='flex justify-between'>
          <div
            className='title' style={{
            marginBottom: '1rem',
          }}>Gắn quyền
          </div>
        </div>
        {renderCollapsibleScopeAssignment()}
      </div>
    </div>
  </div>);
};

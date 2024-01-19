import type { CheckboxOptionType } from 'antd';
import { Button, Checkbox, Collapse, Divider, Form, Input } from 'antd';
import { getOptionCountForEachPermissionGroup, PermissionDto, PERMISSIONS, TotalOptionAndOptionLeft, UpsertRoleForm } from '../../../types/role.type';
import roleApi from '../../../api/role.api';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useNavigate, useParams } from 'react-router-dom';


export const UpdateRole = () => {

  const params: any = useParams();
  const roleId: number = Number(params.roleId);
  const [form] = Form.useForm<UpsertRoleForm>();
  const [loading, setLoading] = useState<boolean>(false);
  const [listOfCheckedButton, setListOfCheckedButton] = useState<CheckboxValueType[]>([]);
  const [listOfCheckAllButton, setListOfCheckAllButton] = useState<string[]>([]);
  const [listOfIndeterminateButton, setListOfIndeterminateButton] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    roleApi.getRoleById(roleId).then((res) => {
      const role = res.data.data;
      form.setFieldsValue({
        name: role.name, description: role.description,
      });
      let _listOfCheckedButton = initListOfCheckedButton(role.permissions);
      let optionCountForEachPermissionGroup = getOptionCountForEachPermissionGroup();
      let optionCountLeftFromEachPermissionGroup = reduceOptionCountForEachPermissionGroup(_listOfCheckedButton, optionCountForEachPermissionGroup);
      initListOfCheckAllButtonAndListOfIndeterminateButton(optionCountLeftFromEachPermissionGroup);
    });
  }, [roleId]);
  const initListOfCheckedButton = (permissions: PermissionDto[]): CheckboxValueType[] => {
    let _listOfCheckedButton: CheckboxValueType[] = permissions.map(permission => permission.name);
    setListOfCheckedButton(_listOfCheckedButton);
    return _listOfCheckedButton;
  };
  const reduceOptionCountForEachPermissionGroup = (_listOfCheckedButton: CheckboxValueType[],
                                                   optionCountForEachPermissionGroup: Map<string, TotalOptionAndOptionLeft>) => {
    let optionCountEachPermissionGroup = new Map<string, TotalOptionAndOptionLeft>(optionCountForEachPermissionGroup);
    _listOfCheckedButton.forEach(value => {
      const permissionGroup = value.toString().split('.')[0];
      let optionCount = optionCountEachPermissionGroup.get(permissionGroup);
      if (optionCount) {
        optionCount.optionLeft--;
      }
      optionCountEachPermissionGroup.set(permissionGroup, optionCount as TotalOptionAndOptionLeft);
    });
    return optionCountEachPermissionGroup;
  };
  const initListOfCheckAllButtonAndListOfIndeterminateButton = (optionCountLeftFromEachPermissionGroup: Map<string, TotalOptionAndOptionLeft>) => {
    let _listOfCheckAllButton: string[] = [];
    let _listOfIndeterminateButton: string[] = [];
    for (let permissionGroup of optionCountLeftFromEachPermissionGroup.keys()) {
      let optionCount = optionCountLeftFromEachPermissionGroup.get(permissionGroup);
      if (optionCount == undefined) {
        return;
      }
      if (optionCount.optionLeft as number === 0) {
        _listOfCheckAllButton.push(permissionGroup);
      } else if (optionCount.optionLeft as number > 0 && optionCount.optionLeft < optionCount.totalOptions) {
        _listOfIndeterminateButton.push(permissionGroup);
      }
    }
    setListOfCheckAllButton(_listOfCheckAllButton);
    setListOfIndeterminateButton(_listOfIndeterminateButton);
  };

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
  const updateRole = (values: UpsertRoleForm) => {
    setLoading(true);
    values = { ...values, permissions: listOfCheckedButton.map(item => item.toString()) };
    roleApi.updateRole(roleId, values).then(() => {
      toast.success(' Cập nhật chức vụ thành công!');
      navigate('/setting/roles');
    }).finally(() => {
      setLoading(false);
    });
  };
  return (<div>
    <div className='flex-between-center'>
      <div className='title'>CẬP NHẬT CHỨC VỤ</div>
    </div>
    <Divider />
    <div className='grid grid-cols-3 gap-5'>

      <Form form={form} layout='vertical' size='large' onFinish={updateRole}>

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
        <div
          className='title' style={{
          marginBottom: '1rem',
        }}>Gắn quyền
        </div>
        {renderCollapsibleScopeAssignment()}
      </div>
    </div>
  </div>);
};

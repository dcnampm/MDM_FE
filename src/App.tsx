import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from 'containers/Signin';
import Signup from 'containers/Signup';
import ResetPassword from 'containers/ResetPassword';
import Repair from 'containers/Equipment/Repair';
import NotFoundPage from 'containers/NotFoundPage';
import PrivateRoute from 'routes/PrivateRoute';
import Dashboard from 'containers/Dashboard';
import List from 'containers/Equipment/Action/ListEquipment';
import Detail from 'containers/Equipment/Action/ViewDetail';
import CreateEquipment from 'containers/Equipment/Action/CreateNewEquipment';
import UpdateEquipment from 'containers/Equipment/Action/UpdateEquipment';
import Maintenance from 'containers/Equipment/Maintenance';
import Department from 'containers/Organization/Department';
import CreateDepartment from 'containers/Organization/Department/create';
import DetailDepartment from 'containers/Organization/Department/detail';
import CreateUser from 'containers/Organization/User/CreateUser';
import EquipmentGroup from 'containers/Category/EquipmentGroup';
import EquipmentType from 'containers/Category/EquipmentCategory';
import EquipmentUnit from 'containers/Category/EquipmentUnit';
import SetRole from 'containers/Setting/Role';
import NotificationList from 'containers/Notification';
import StatisticEquipment from 'containers/Equipment/StatisticEquipment/StatisticEquipment';
import CreateSchedule from 'containers/Equipment/Repair/CreateSchedule';
import UpdateSchedule from 'containers/Equipment/Repair/UpdateSchedule';
import Liquidation from 'containers/Equipment/Liquidation';
import LiquidationDetail from 'containers/Equipment/Liquidation/detail';
import Suplly from 'containers/Supply';
import SupplyDetail from 'containers/Supply/SupplyDetail';
import { ToastContainer } from 'react-toastify';
import Transfer from 'containers/Equipment/Transfer';
import TransferDetail from 'containers/Equipment/Transfer/detail';
import EmailConfig from 'containers/Setting/Symtem/EmailConfig';
import Profile from 'containers/Profile';
import ConfirmResetPassword from './containers/ResetPassword/ConfirmResetPassword';
import UpdateMaintenance from './containers/Equipment/Maintenance/UpdateMaintenance';
import Inspection from './containers/Equipment/Inspection';
import UpdateInspection from './containers/Equipment/Inspection/UpdateInspection';
import Handover from './containers/Equipment/Handover';
import ReportBroken from 'containers/Equipment/ReportBroken';
import { Authority } from 'constants/authority';
import { CreateRole } from 'containers/Setting/Role/CreateRole';
import User from 'containers/Organization/User';
import DetailUser from 'containers/Organization/User/DetailUser';
import { UpdateRole } from 'containers/Setting/Role/UpdateRole';
import CreateSupply from 'containers/Supply/CreateSupply';
import UpdateSupply from 'containers/Supply/UpdateSupply';
import Supplier from './containers/Organization/Supplier';
import Service from './containers/Category/Service';
import AttachSupplies from './containers/Equipment/Action/AttachSupplies';
import EquipmentImportFileExcel from 'components/EquipmentImportFileExcel';
import Noti from 'components/Noti';
import StatisticEquipmentDepartment from 'containers/Equipment/StatisticEquipment/StatisticEquipmentDepartmentAndStatus';
// import StatisticEquipmentGroup from 'src/containers/Equipment/StatisticEquipment/StatisticEquipmentGroup';
import StatisticEquipmentDepartmentAndStatus from 'containers/Equipment/StatisticEquipment/StatisticEquipmentDepartmentAndStatus';
import StatisticEquipmentGroup from 'containers/Equipment/StatisticEquipment/StatisticEquipmentGroup';

const App = () => {
  return (<div className='app'>
    <BrowserRouter>
      {/*TODO: sua lai cac authority cho dung*/}
      <Routes>
        <Route path='/' element={<PrivateRoute requiredAuthority={Authority.DASHBOARD_READ}><Dashboard /></PrivateRoute>} />
        {/*<Route path='/' element={<Dashboard />} />*/}
        {/* Equipment Routes */}
        <Route path='/equipments' element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_READ}><List /></PrivateRoute>} />
        <Route path='/equipments/excel/import' element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_CREATE}><EquipmentImportFileExcel/></PrivateRoute>} />
        <Route
          path='/equipments/:equipmentId'
          element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_READ}><Detail /></PrivateRoute>} />
        <Route
          path='/equipments/:equipmentId/update'
          element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_UPDATE}><UpdateEquipment /></PrivateRoute>} />
        <Route
          path='/equipments/create'
          element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_CREATE}><CreateEquipment /></PrivateRoute>} />

        {/* Equipment handover Routes */}
        <Route
          path='/equipments/handovers'
          element={<PrivateRoute requiredAuthority={Authority.HANDOVER_READ}><Handover /></PrivateRoute>} />

        {/* Equipment report broken Routes */}
        <Route
          path='/equipments/report-broken'
          element={<PrivateRoute requiredAuthority={Authority.HANDOVER_READ}><ReportBroken /></PrivateRoute>} />


        {/* Equipment Repair Routes */}
        <Route
          path='/equipments/repairs'
          element={<PrivateRoute requiredAuthority={Authority.REPAIR_READ}><Repair /></PrivateRoute>} />
        <Route
          path='/equipments/:equipmentId/repairs/create-schedule'
          element={<PrivateRoute requiredAuthority={Authority.REPAIR_CREATE}><CreateSchedule /></PrivateRoute>} />
        {/*/equipments/repairs/update-schedule/:id/:repair-id*/}
        <Route
          path='/equipments/:equipmentId/repairs/:repairTicketId/update-schedule'
          element={<PrivateRoute requiredAuthority={Authority.REPAIR_UPDATE}><UpdateSchedule /></PrivateRoute>} />

        {/* Equipment Liquidation Routes */}
        <Route
          path='/equipments/liquidations'
          element={<PrivateRoute requiredAuthority={Authority.LIQUIDATION_READ}><Liquidation /></PrivateRoute>} />
        <Route
          path='/equipments/:id/liquidations'
          element={<PrivateRoute requiredAuthority={Authority.LIQUIDATION_CREATE}><LiquidationDetail /></PrivateRoute>} />

        {/* Equipment Transfer Routes */}
        <Route
          path='/equipments/transfers'
          element={<PrivateRoute requiredAuthority={Authority.TRANSFER_READ}><Transfer /></PrivateRoute>} />
        <Route
          path='/equipments/transfers/:equipmentId'
          element={<PrivateRoute requiredAuthority={Authority.TRANSFER_READ}><TransferDetail /></PrivateRoute>} />
        {/* Equipment Maintainance */}
        <Route
          path='/equipments/maintenances'
          element={<PrivateRoute requiredAuthority={Authority.DASHBOARD_READ}><Maintenance /></PrivateRoute>} />
        <Route
          path='/equipments/:equipmentId/maintenances/:maintenanceId/update'
          element={<PrivateRoute requiredAuthority={Authority.MAINTENANCE_UPDATE}><UpdateMaintenance /></PrivateRoute>} />

        {/*Equipment Inspection*/}
        <Route
          path='/equipments/inspections'
          element={<PrivateRoute requiredAuthority={Authority.DASHBOARD_READ}><Inspection /></PrivateRoute>} />
        <Route
          path='/equipments/:equipmentId/inspections/:inspectionId/update'
          element={<PrivateRoute requiredAuthority={Authority.INSPECTION_UPDATE}><UpdateInspection /></PrivateRoute>} />

        <Route
          path='/equipments/:equipmentId/attach-supplies'
          element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_UPDATE}>< AttachSupplies /></PrivateRoute>} />
        {/* Supply Routes */}
        <Route
          path='/supplies'
          element={<PrivateRoute requiredAuthority={Authority.IMPORT_SUPPLIES}><Suplly /></PrivateRoute>} />
        <Route
          path='/supplies/:supplyId'
          element={<PrivateRoute requiredAuthority={Authority.IMPORT_SUPPLIES}><SupplyDetail /></PrivateRoute>} />
        <Route
          path='/supplies/create'
          element={<PrivateRoute requiredAuthority={Authority.IMPORT_SUPPLIES}><CreateSupply /></PrivateRoute>} />
        <Route
          path='/supplies/:supplyId/update'
          element={<PrivateRoute requiredAuthority={Authority.IMPORT_SUPPLIES}><UpdateSupply /></PrivateRoute>} />
        {/* StatisticEquipment Routes */}
        <Route
          path='/statistic/equipments'
          element={<PrivateRoute requiredAuthority={Authority.STATISTIC_EQUIPMENT}><StatisticEquipment /></PrivateRoute>} />
        <Route
          path='/statistic/equipments/departments/statuses'
          element={<PrivateRoute requiredAuthority={Authority.STATISTIC_EQUIPMENT}><StatisticEquipmentDepartmentAndStatus /></PrivateRoute>} />
        <Route
          path='/statistic/equipments/groups'
          element={<PrivateRoute requiredAuthority={Authority.STATISTIC_EQUIPMENT}><StatisticEquipmentGroup /></PrivateRoute>} />


        {/* Organization Routes */}
        <Route
          path='/organization/departments'
          element={<PrivateRoute requiredAuthority={Authority.DEPARTMENT_READ}><Department /></PrivateRoute>} />
        <Route
          path='/organization/departments/create'
          element={<PrivateRoute requiredAuthority={Authority.DEPARTMENT_CREATE}><CreateDepartment /></PrivateRoute>} />
        <Route
          path='/organization/departments/:departmentId'
          element={<PrivateRoute requiredAuthority={Authority.DEPARTMENT_UPDATE}><DetailDepartment /></PrivateRoute>} />
        <Route
          path='/organization/suppliers'
          element={<PrivateRoute requiredAuthority={Authority.SUPPLY_READ}><Supplier /></PrivateRoute>} />
        <Route
          path='/organization/users'
          element={<PrivateRoute requiredAuthority={Authority.USER_READ}><User /></PrivateRoute>} />

        <Route
          path='/organization/users/create'
          element={<PrivateRoute requiredAuthority={Authority.USER_CREATE}><CreateUser /></PrivateRoute>} />
        <Route
          path='/organization/users/:userId'
          element={<PrivateRoute requiredAuthority={Authority.USER_READ}><DetailUser /></PrivateRoute>} />

        {/* Profile Routes */}
        <Route path='/profile' element={<PrivateRoute requiredAuthority={Authority.USER_READ}><Profile /></PrivateRoute>} />

        {/* Category Routes */}

        {/* Group */}
        <Route
          path='/category/equipment-groups'
          element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_GROUP_READ}><EquipmentGroup /></PrivateRoute>} />

        {/* Type */}
        <Route
          path='/category/equipment-categories'
          element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_CATEGORY_READ}><EquipmentType /></PrivateRoute>} />

        {/* Unit */}
        <Route
          path='/category/equipment-units'
          element={<PrivateRoute requiredAuthority={Authority.EQUIPMENT_UNIT_READ}><EquipmentUnit /></PrivateRoute>} />
        <Route
          path='/category/services'
          element={<PrivateRoute requiredAuthority={Authority.SERVICE_READ}><Service /></PrivateRoute>} />
        {/* Setting Routes */}
        <Route path='/setting/roles' element={<PrivateRoute requiredAuthority={Authority.ROLE_READ}><SetRole /></PrivateRoute>} />
        <Route
          path='/setting/roles/:roleId/update'
          element={<PrivateRoute requiredAuthority={Authority.DASHBOARD_READ}><UpdateRole /></PrivateRoute>} />
        <Route
          path='/setting/roles/create'
          element={<PrivateRoute requiredAuthority={Authority.ROLE_CREATE}><CreateRole /></PrivateRoute>} />
        <Route
          path='/setting/notifications'
          element={<PrivateRoute requiredAuthority={Authority.DASHBOARD_READ}><NotificationList /></PrivateRoute>} />
        <Route
          path='/setting/email-config'
          element={<PrivateRoute requiredAuthority={Authority.DASHBOARD_READ}><EmailConfig /></PrivateRoute>} />

        {/* Auth Routes */}
        <Route path='/signin' element={< Signin />} />
        <Route path='/signup' element={< Signup />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/reset-password/confirm' element={<ConfirmResetPassword />} />
        <Route path='*' element={<NotFoundPage />} />

        {/* <Route path='websocket' element={<Noti />} /> */}
      </Routes>
    </BrowserRouter>
    <ToastContainer
      position='top-right'
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='light'
    />
  </div>);
};

export default App;
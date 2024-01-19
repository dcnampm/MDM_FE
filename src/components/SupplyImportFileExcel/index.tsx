import * as fs from 'file-saver';
import { Button } from 'antd';
import { FileExcelFilled } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { addRow } from 'utils/globalFunc.util';

const SupplyImportFileExcel = () => {
  const exportToExcel = () => {
    const myHeader = [
      'Tên vật tư', 'Code', 'Model', 'Serial',
      'Hãng sản xuất', 'Xuất xứ', 'Năm sản xuất', 'Năm sử dụng',
      'Ngày nhập kho', 'Dự án', 'Ghi chú', 'Thông số kỹ thuật', 
      'Cấu hình kỹ thuật', 'Giá nhập', 'Mức độ rủi ro',
      'Quy trình sử dụng', 'Đơn vị tính', 'Loại vật tư'
    ]
    const widths = myHeader.map((item: any) => ({ width: 25 }));
    exportToExcelPro('File excel mẫu nhập vật tư', 'Sheet A', myHeader, widths);
  };

  const exportToExcelPro = async (
    fileName: any,
    sheetName: any,
    myHeader: any,
    widths: any
  ) => {

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(sheetName);

    const header = {
      border: true,
      height: 0,
      font: { size: 12, bold: true, color: { argb: '000000' } },
      alignment: null,
      fill: null,
    };
    if (widths && widths.length > 0) {
      ws.columns = widths;
    }
    addRow(ws, myHeader, header);
    const buf = await wb.xlsx.writeBuffer();
    fs.saveAs(new Blob([buf]), `${fileName}.xlsx`);
  }


  return (
    <Button className="button_excel" onClick={() => exportToExcel()}>
      <FileExcelFilled />
      <div className="font-medium text-md text-[#5B69E6]">EXCEL mẫu</div>
    </Button>
  );
};




export default SupplyImportFileExcel;
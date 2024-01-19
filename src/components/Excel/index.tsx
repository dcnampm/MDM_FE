import * as fs from 'file-saver';
import { Button } from 'antd';
import { FileExcelFilled } from '@ant-design/icons';
import ExcelJS from 'exceljs';
import { addRow, mergeCells } from 'utils/globalFunc.util';

export interface Props {
  data : any,
  fileName: string,
  headerName: string[]
  sheetName : string
  title: string
}

const ExportToExcel = (excel: Props) => {

  const exportToExcel = () => {
    const {data, fileName, headerName, sheetName, title} = excel;
    if (!data || data.length === 0) {
      return;
    }
    const d = new Date();
    const _fileName = fileName + " " + d.toLocaleString();
    const myHeader = headerName;
    const widths = headerName.map(item => ({width : 20}));
    // let newData: any = data.slice(1, data?.length);
    exportToExcelPro(
      data,
      _fileName,
      sheetName,
      title,
      myHeader,
      widths
    );
  };

  const exportToExcelPro = async (
    myData: any,
    fileName: any,
    sheetName: any,
    report: any,
    myHeader: any,
    widths: any
  ) => {
    if (!myData || myData.length === 0) {
      console.error('Chưa có data');
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(sheetName);
    const columns = myHeader?.length;

    const title = {
      // border: true,
      height: 30,
      font: { size: 18, bold: false, 
        // color: { argb: 'FFFFFF' } 
      },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        // pattern: 'solid', //darkVertical
        fgColor: {
          argb: '#dbeafe',
        },
      },
    };
    const header = {
      border: true,
      height: 0,
      font: { size: 12, bold: true, color: { argb: '000000' } },
      alignment: null,
      fill: {
        type: 'pattern',
        pattern: 'none',
        // fgColor: 'none',
        bgColor: {
          argb:'DBEAFE',
        },
      },
    };
    const data = {
      border: true,
      height: 0,
      font: { size: 12, bold: false, color: { argb: '000000' } },
      alignment: null,
      fill: null,
    };

    if (widths && widths.length > 0) {
      ws.columns = widths;
    }
    addRow(ws, null, null);
    let row = addRow(ws, [report], title);
    mergeCells(ws, row, 1, columns);
    addRow(ws, null, null);
    addRow(ws, myHeader, header);

    myData.forEach((row: any) => {
      addRow(ws, Object.values(row), data);
    });

    ws.getRow(4).eachCell((cell) => cell.fill = {
      type : 'pattern',
      pattern:'solid',
      fgColor: {
        argb:'DBEAFE',
      }
    })
    
    const buf = await wb.xlsx.writeBuffer();
    fs.saveAs(new Blob([buf]), `${fileName}.xlsx`);
  }

  return (
    <Button
      className="button_excel"
      onClick={() => exportToExcel()}
    >
      <FileExcelFilled />
      <div className="font-medium text-md text-[#5B69E6]">Xuất Excel</div>
    </Button>
  );
}

export default ExportToExcel;
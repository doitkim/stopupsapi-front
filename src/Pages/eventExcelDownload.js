import axios from "axios";
import * as FileSaver from "file-saver";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const EventExcelDownload = ({ apiKey }) => {
  const [data, setData] = useState({});
  const getAxios = async () => {
    const res = await axios.get(apiKey + `&Event=ALL&Title=&EventId=`);
    setData(res.data);
  };
  useEffect(() => {
    getAxios();
  }, []);

  const excelFileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const excelFileExtension = ".xlsx";
  const excelFileName = "이미지 현황";

  const excelDownload = (excelData) => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Date", "EventId", "Title", "EventTime", "Image"],
    ]);
    excelData.map((data) => {
      if (data.Image) {
        Object.values(data.Image).map((e) => {
          console.log(e);
          XLSX.utils.sheet_add_aoa(
            ws,
            [[data.Date, data.EventId, data.Title, data.EventTime, e]],
            {
              origin: -1,
            }
          );
        });
      }
      ws["!cols"] = [
        // 행 사이즈
        { wpx: 200 },
        { wpx: 200 },
      ];
      return false;
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelButter = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelButter], { type: excelFileType });
    FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
  };

  return (
    <div>
      <button onClick={() => excelDownload(data)} style={{ border: 0 }}>
        <img
          src="https://w7.pngwing.com/pngs/2/544/png-transparent-microsoft-excel-encapsulated-postscript-computer-icons-exel-angle-text-rectangle.png"
          width="35px"
        />
      </button>
    </div>
  );
};

export default EventExcelDownload;

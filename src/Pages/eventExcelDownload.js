import { Button } from "@mui/material";
import axios from "axios";
import * as FileSaver from "file-saver";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const EventExcelDownload = ({ apiKey, EVENTSEARCHALL }) => {
  const [data, setData] = useState({});
  const getAxios = async () => {
    const res = await axios.get(apiKey + EVENTSEARCHALL);
    setData(res.data);
  };
  useEffect(() => {
    getAxios();
  }, []);

  const excelFileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const excelFileExtension = ".xlsx";
  const excelFileName = "이벤트 현황";

  const excelDownload = (excelData) => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Date", "EventId", "Title", "EventTime", "Image"],
    ]);
    excelData.map((data) => {
      if (data.Image) {
        Object.values(data.Image).map((e) => {
          XLSX.utils.sheet_add_aoa(
            ws,
            [
              [
                data.Date,
                data.EventId,
                data.Title,
                data.EventTime,
                data.Proceed,
                e,
              ],
            ],
            {
              origin: -1,
            }
          );
        });
      } else {
        XLSX.utils.sheet_add_aoa(
          ws,
          [[data.Date, data.EventId, data.Title, data.EventTime, data.Proceed]],
          {
            origin: -1,
          }
        );
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
  const EXCEL = {
    m: 0.2,
    color: "gray",
    borderColor: "gray",
  };
  return (
    <Button sx={EXCEL} variant="outlined" onClick={() => excelDownload(data)}>
      엑셀
    </Button>
  );
};

export default EventExcelDownload;

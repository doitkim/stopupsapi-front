import { Button } from "@mui/material";
import axios from "axios";
import * as FileSaver from "file-saver";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const MenuExcelDownload = ({ apiKey, MENUSEARCHALL }) => {
  const [data, setData] = useState({});
  const getAxios = async () => {
    const res = await axios.get(apiKey + MENUSEARCHALL);
    setData(res.data);
  };
  useEffect(() => {
    getAxios();
  }, []);

  const excelFileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const excelFileExtension = ".xlsx";
  const excelFileName = "메뉴 현황";

  const excelDownload = (excelData) => {
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Category",
        "Image",
        "Name",
        "Desc",
        "Caffeine",
        "Carbohydrate",
        "Cholesterol",
        "DefaultSize",
        "Fat",
        "Na",
        "Protein",
        "SaturatedFat",
        "Sugar",
        "TransFat",
        "kcal",
        "Grande",
        "Tall",
        "Venti",
        "ProductId",
        "HOT",
        "ICED",
        "TAKEOUT",
        "SHOP",
        "COOKED",
        "NOTCOOKED",
      ],
    ]);
    excelData.map((data) => {
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            data.Category,
            data.Image,
            data.Name,
            data.Desc,
            data.Nutrient.Caffeine,
            data.Nutrient.Carbohydrate,
            data.Nutrient.Cholesterol,
            data.Nutrient.DefaultSize,
            data.Nutrient.Fat,
            data.Nutrient.Na,
            data.Nutrient.Protein,
            data.Nutrient.SaturatedFat,
            data.Nutrient.Sugar,
            data.Nutrient.TransFat,
            data.Nutrient.kcal,
            data.Price.Grande,
            data.Price.Tall,
            data.Price.Venti,
            data.ProductId,
            data.DrinkType.HOT,
            data.DrinkType.ICED,
            data.EatType.TAKEOUT,
            data.EatType.SHOP,
            data.CookType.COOKED,
            data.CookType.NOTCOOKED,
          ],
        ],
        {
          origin: -1,
        }
      );
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
    <Button
      sx={{ m: 0.2, color: "gray", borderColor: "gray" }}
      variant="outlined"
      onClick={() => excelDownload(data)}
    >
      엑셀
    </Button>
  );
};

export default MenuExcelDownload;

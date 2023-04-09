import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const MenuAlter = ({ menu, API }) => {
  // 수정할 기존 상품의 정보를 받아서 표시하고 이후 바뀐 정보를 다시 저장
  // value 만 사용할 경우 input 값 수정이 불가
  // 제품 ID는 바뀌면 안되므로 disable 처리
  const navigate = useNavigate();
  const [altMenu, setAltMenu] = useState({});
  const [drinkChecked, setDrinkChecked] = useState([true, false]);
  const [eatChecked, setEatChecked] = useState([true, false]);
  const [cookChecked, setCookChecked] = useState([true, false]);

  useEffect(() => {
    setAltMenu({
      Category: menu[0].Category,
      ProductId: menu[0].ProductId,
      Name: menu[0].Name,
      Image: menu[0].Image,
      Desc: menu[0].Desc,
      Kcal: menu[0].Nutrient.kcal,
      Carbohydrate: menu[0].Nutrient.Carbohydrate,
      Sugar: menu[0].Nutrient.Sugar,
      Na: menu[0].Nutrient.Na,
      Protein: menu[0].Nutrient.Protein,
      Fat: menu[0].Nutrient.Fat,
      Cholesterol: menu[0].Nutrient.Cholesterol,
      TransFat: menu[0].Nutrient.TransFat,
      Caffeine: menu[0].Nutrient.Caffeine,
      SaturatedFat: menu[0].Nutrient.SaturatedFat,
      DefaultSize: menu[0].Nutrient.DefaultSize,
      Tall: menu[0].Price.Tall,
      Grande: menu[0].Price.Grande,
      Venti: menu[0].Price.Venti,
      Desert: menu[0].Price.Desert,
      Hot: menu[0].DrinkType["HOT"],
      Iced: menu[0].DrinkType["ICED"],
      TakeOut: menu[0].EatType["TAKEOUT"],
      Shop: menu[0].EatType["SHOP"],
      Cooked: menu[0].CookType["COOKED"],
      NotCooked: menu[0].CookType["NOTCOOKED"],
    });
  }, []);

  const DrinkhandleChange1 = (event) => {
    setDrinkChecked([event.target.checked, event.target.checked]);
  };

  const DrinkhandleChange2 = (event) => {
    setDrinkChecked([event.target.checked, drinkChecked[1]]);
  };

  const DrinkhandleChange3 = (event) => {
    setDrinkChecked([drinkChecked[0], event.target.checked]);
  };

  const EathandleChange1 = (event) => {
    setEatChecked([event.target.checked, event.target.checked]);
  };

  const EathandleChange2 = (event) => {
    setEatChecked([event.target.checked, eatChecked[1]]);
  };

  const EathandleChange3 = (event) => {
    setEatChecked([eatChecked[0], event.target.checked]);
  };

  const CookhandleChange1 = (event) => {
    setCookChecked([event.target.checked, event.target.checked]);
  };

  const CookhandleChange2 = (event) => {
    setCookChecked([event.target.checked, cookChecked[1]]);
  };

  const CookhandleChange3 = (event) => {
    setCookChecked([cookChecked[0], event.target.checked]);
  };

  useEffect(() => {
    if (altMenu.Hot !== undefined) {
      setDrinkChecked([altMenu.Hot, altMenu.Iced]);
      setEatChecked([altMenu.TakeOut, altMenu.Shop]);
      setCookChecked([altMenu.Cooked, altMenu.NotCooked]);
    }
  }, [altMenu]);
  const RADIOCSS = {
    display: "flex",
    flexDirection: "column",
    ml: 3,
  };
  const DrinkTypeCheck = (
    <Box sx={RADIOCSS}>
      <FormControlLabel
        label="HOT"
        control={
          <Checkbox
            checked={drinkChecked[0]}
            onChange={DrinkhandleChange2}
            name="HOT"
          />
        }
      />
      <FormControlLabel
        label="ICED"
        control={
          <Checkbox
            checked={drinkChecked[1]}
            onChange={DrinkhandleChange3}
            name="ICED"
          />
        }
      />
    </Box>
  );

  const EatTypeCheck = (
    <Box sx={RADIOCSS}>
      <FormControlLabel
        label="TAKE OUT"
        control={
          <Checkbox
            checked={eatChecked[0]}
            onChange={EathandleChange2}
            name="TAKEOUT"
          />
        }
      />
      <FormControlLabel
        label="SHOP"
        control={
          <Checkbox
            checked={eatChecked[1]}
            onChange={EathandleChange3}
            name="SHOP"
          />
        }
      />
    </Box>
  );

  const CookTypeCheck = (
    <Box sx={RADIOCSS}>
      <FormControlLabel
        label="COOKED"
        control={
          <Checkbox
            checked={cookChecked[0]}
            onChange={CookhandleChange2}
            name="COOKED"
          />
        }
      />
      <FormControlLabel
        label="NOT COOKED"
        control={
          <Checkbox
            checked={cookChecked[1]}
            onChange={CookhandleChange3}
            name="NOTCOOKED"
          />
        }
      />
    </Box>
  );

  const onChange = (e) => {
    setAltMenu(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const Category = e.target.Category.value;
    const ProductId = e.target.ProductId.value;
    const Name = e.target.Name.value;
    const Image = e.target.Image.value;
    const Desc = e.target.Desc.value;
    const Nutrient = {
      kcal: e.target.kcal.value,
      Carbohydrate: e.target.Carbohydrate.value,
      Sugar: e.target.Sugar.value,
      Na: e.target.Na.value,
      Protein: e.target.Protein.value,
      Fat: e.target.Fat.value,
      Cholesterol: e.target.Cholesterol.value,
      TransFat: e.target.TransFat.value,
      Caffeine: e.target.Caffeine.value,
      SaturatedFat: e.target.SaturatedFat.value,
      DefaultSize: e.target.DefaultSize.value,
    };
    const Price = {
      Tall: e.target.Tall.value,
      Grande: e.target.Grande.value,
      Venti: e.target.Venti.value,
      Desert: e.target.Desert.value,
    };
    const DrinkType = {
      HOT: e.target.children.옵션.children[0].children[1].children[0]
        .children[0].children.HOT.checked,
      ICED: e.target.children.옵션.children[0].children[1].children[1]
        .children[0].children.ICED.checked,
    };
    const EatType = {
      TAKEOUT:
        e.target.children.옵션.children[1].children[1].children[0].children[0]
          .children.TAKEOUT.checked,
      SHOP: e.target.children.옵션.children[1].children[1].children[1]
        .children[0].children.SHOP.checked,
    };
    const CookType = {
      COOKED:
        e.target.children.옵션.children[2].children[1].children[0].children[0]
          .children.COOKED.checked,
      NOTCOOKED:
        e.target.children.옵션.children[2].children[1].children[1].children[0]
          .children.NOTCOOKED.checked,
    };

    try {
      // 정보 수정후 등록
      await axios
        .post(API + "/menu/alter", {
          Category,
          ProductId,
          Name,
          Image,
          Desc,
          Nutrient,
          Price,
          DrinkType,
          EatType,
          CookType,
        })
        .then(navigate("/"));
    } catch (error) {
      console.error(error);
    }
    e.target.email.value = "";
    e.target.password.value = "";
  };

  const MENUCREATE = {
    padding: 10,
    backgroundColor: "#b5e4fb",
    overflow: "auto",
    width: 800,
    height: 800,
  };
  const TEXTFEILD = {
    m: 1,
    "& .MuiOutlinedInput-root": {
      "& > fieldset": { borderColor: "#316ca4" },
    },
    "& .MuiOutlinedInput-root:hover": {
      "& > fieldset": {
        borderColor: "#1877d5",
      },
    },
  };
  return (
    <form onSubmit={onSubmit} style={MENUCREATE}>
      <Box sx={{ color: "#5498d8" }}>
        <TextField
          size="small"
          name="Category"
          required
          autoFocus
          sx={TEXTFEILD}
          label="카테고리"
          onChange={onChange}
          value={altMenu.Category}
        />
        <TextField
          size="small"
          name="ProductId"
          required
          autoFocus
          sx={TEXTFEILD}
          label="제품번호"
          onChange={onChange}
          value={altMenu.ProductId}
          disabled
        />
        <TextField
          size="small"
          name="Name"
          required
          autoFocus
          sx={TEXTFEILD}
          label="제품 이름"
          onChange={onChange}
          value={altMenu.Name}
        />
        <TextField
          size="small"
          name="Image"
          autoFocus
          sx={TEXTFEILD}
          label="제품 이미지"
          onChange={onChange}
          value={altMenu.Image}
        />
        <TextField
          size="small"
          name="Desc"
          autoFocus
          sx={TEXTFEILD}
          label="제품 설명"
          onChange={onChange}
          value={altMenu.Desc}
        />
      </Box>
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={{ bgcolor: "#316ca4" }}>
          <h2>제품 영양 성분</h2>
        </Box>
        <TextField
          size="small"
          name="kcal"
          autoFocus
          sx={TEXTFEILD}
          label="칼로리"
          onChange={onChange}
          value={altMenu.Kcal}
        />
        <TextField
          size="small"
          name="Carbohydrate"
          autoFocus
          sx={TEXTFEILD}
          label="탄수화물"
          onChange={onChange}
          value={altMenu.Carbohydrate}
        />
        <TextField
          size="small"
          name="Sugar"
          autoFocus
          sx={TEXTFEILD}
          label="당류"
          onChange={onChange}
          value={altMenu.Sugar}
        />
        <TextField
          size="small"
          name="Na"
          autoFocus
          sx={TEXTFEILD}
          label="나트륨"
          onChange={onChange}
          value={altMenu.Na}
        />
        <TextField
          size="small"
          name="Protein"
          autoFocus
          sx={TEXTFEILD}
          label="단백질"
          onChange={onChange}
          value={altMenu.Protein}
        />
        <TextField
          size="small"
          name="Fat"
          autoFocus
          sx={TEXTFEILD}
          label="지방"
          onChange={onChange}
          value={altMenu.Fat}
        />
        <TextField
          size="small"
          name="Cholesterol"
          autoFocus
          sx={TEXTFEILD}
          label="콜레스테롤"
          onChange={onChange}
          value={altMenu.Cholesterol}
        />
        <TextField
          size="small"
          name="TransFat"
          autoFocus
          sx={TEXTFEILD}
          label="트렌스지방"
          onChange={onChange}
          value={altMenu.TransFat}
        />
        <TextField
          size="small"
          name="Caffeine"
          autoFocus
          sx={TEXTFEILD}
          label="카페인"
          onChange={onChange}
          value={altMenu.Caffeine}
        />
        <TextField
          size="small"
          name="SaturatedFat"
          autoFocus
          sx={TEXTFEILD}
          label="포화지방"
          onChange={onChange}
          value={altMenu.SaturatedFat}
        />
        <TextField
          size="small"
          name="DefaultSize"
          autoFocus
          sx={TEXTFEILD}
          label="기준 사이즈"
          onChange={onChange}
          value={altMenu.DefaultSize}
        />
      </Box>
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={{ bgcolor: "#316ca4", minWidth: "450px" }}>
          <h2>제품 사이즈 별 가격 (음료)</h2>
        </Box>
        <TextField
          size="small"
          name="Tall"
          autoFocus
          sx={TEXTFEILD}
          label="Tall"
          onChange={onChange}
          value={altMenu.Tall}
        />
        <TextField
          size="small"
          name="Grande"
          autoFocus
          sx={TEXTFEILD}
          label="Grade"
          onChange={onChange}
          value={altMenu.Grande}
        />
        <TextField
          size="small"
          name="Venti"
          placeholder="Venti"
          autoFocus
          sx={TEXTFEILD}
          label="Venti"
          onChange={onChange}
          value={altMenu.Venti}
        />
      </Box>

      <Box sx={{ color: "#5498d8" }}>
        <Box sx={{ bgcolor: "#316ca4" }}>
          <h2>제품 가격 (디저트)</h2>
        </Box>
        <TextField
          size="small"
          name="Desert"
          autoFocus
          sx={TEXTFEILD}
          label="Desert"
          onChange={onChange}
          value={altMenu.Desert}
        />
      </Box>
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={{ bgcolor: "#316ca4" }}>
          <h2>옵션</h2>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }} name="옵션">
        <Box sx={{ p: 1 }}>
          <FormControlLabel
            label="음료 타입"
            control={
              <Checkbox
                checked={drinkChecked[0] && drinkChecked[1]}
                indeterminate={drinkChecked[0] !== drinkChecked[1]}
                onChange={DrinkhandleChange1}
              />
            }
          />
          {DrinkTypeCheck}
        </Box>
        <Box sx={{ p: 1 }}>
          <FormControlLabel
            label="취식 타입"
            control={
              <Checkbox
                checked={eatChecked[0] && eatChecked[1]}
                indeterminate={eatChecked[0] !== eatChecked[1]}
                onChange={EathandleChange1}
              />
            }
          />
          {EatTypeCheck}
        </Box>
        <Box sx={{ p: 1 }}>
          <FormControlLabel
            label="요리 타입"
            control={
              <Checkbox
                checked={cookChecked[0] && cookChecked[1]}
                indeterminate={cookChecked[0] !== cookChecked[1]}
                onChange={CookhandleChange1}
              />
            }
          />
          {CookTypeCheck}
        </Box>
      </Box>
      <Button
        type="submit"
        sx={{ m: 1, color: "#5498d8", borderColor: "#1877d5" }}
        variant="outlined"
      >
        등록
      </Button>
    </form>
  );
};

export default MenuAlter;

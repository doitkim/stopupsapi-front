import axios from "axios";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuCreate = ({ apiKey, API, MENUSEARCHALL }) => {
  const navigate = useNavigate();
  const [drinkChecked, setDrinkChecked] = useState([true, false]);
  const [eatChecked, setEatChecked] = useState([true, false]);
  const [cookChecked, setCookChecked] = useState([true, false]);

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

  const RADIOCSS = { display: "flex", flexDirection: "column", ml: 3 };
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

  const menuCreate = async (e) => {
    // 메뉴 등록
    e.preventDefault();

    const DrinkType = {
      HOT: e.target.children[5].children[0].children[1].children[0].children[0]
        .children.HOT.checked,
      ICED: e.target.children[5].children[0].children[1].children[1].children[0]
        .children.ICED.checked,
    };

    const EatType = {
      TAKEOUT:
        e.target.children[5].children[1].children[1].children[0].children[0]
          .children.TAKEOUT.checked,
      SHOP: e.target.children[5].children[1].children[1].children[1].children[0]
        .children.SHOP.checked,
    };

    const CookType = {
      COOKED:
        e.target.children[5].children[2].children[1].children[0].children[0]
          .children.COOKED.checked,
      NOTCOOKED:
        e.target.children[5].children[2].children[1].children[1].children[0]
          .children.NOTCOOKED.checked,
    };

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

    const res = await axios.get(apiKey + MENUSEARCHALL + `${Name}`);

    if (res.data[0] === undefined || res.data[0].Name !== Name) {
      try {
        await axios
          .post(API + "/menu/create", {
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
    } else {
      alert("이미 존재하는 제품입니다.");
    }
  };

  const MENUCREATE = {
    flexWrap: "nowrap",
    padding: 10,
    backgroundColor: "#b5e4fb",
    overflow: "auto",
    width: 800,
    height: 800,
  };
  const TITLE = { bgcolor: "#316ca4", minWidth: "450px" };
  const TEXTFIELD = {
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
  const CLOSE = { m: 1, color: "#5498d8", borderColor: "#1877d5" };
  return (
    <form onSubmit={menuCreate} style={MENUCREATE}>
      <Box sx={{ color: "#5498d8" }}>
        <TextField
          size="small"
          name="Category"
          required
          autoFocus
          sx={TEXTFIELD}
          label="카테고리"
        />
        <TextField
          size="small"
          name="ProductId"
          required
          autoFocus
          sx={{
            m: 1,
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: "#316ca4" },
            },
            "& .MuiOutlinedInput-root:hover": {
              "& > fieldset": {
                borderColor: "#1877d5",
              },
            },
          }}
          label="제품번호"
        />
        <TextField
          size="small"
          name="Name"
          required
          autoFocus
          sx={TEXTFIELD}
          label="제품 이름"
        />
        <TextField
          size="small"
          name="Image"
          autoFocus
          sx={TEXTFIELD}
          label="제품 이미지"
        />
        <TextField
          size="small"
          name="Desc"
          autoFocus
          sx={TEXTFIELD}
          label="제품 설명"
        />
      </Box>
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={TITLE}>
          <h2>제품 영양 성분</h2>
        </Box>
        <TextField
          size="small"
          name="kcal"
          autoFocus
          sx={TEXTFIELD}
          label="칼로리"
        />
        <TextField
          size="small"
          name="Carbohydrate"
          autoFocus
          sx={TEXTFIELD}
          label="탄수화물"
        />
        <TextField
          size="small"
          name="Sugar"
          autoFocus
          sx={TEXTFIELD}
          label="당류"
        />
        <TextField
          size="small"
          name="Na"
          autoFocus
          sx={TEXTFIELD}
          label="나트륨"
        />
        <TextField
          size="small"
          name="Protein"
          autoFocus
          sx={TEXTFIELD}
          label="단백질"
        />
        <TextField
          size="small"
          name="Fat"
          autoFocus
          sx={TEXTFIELD}
          label="지방"
        />
        <TextField
          size="small"
          name="Cholesterol"
          autoFocus
          sx={TEXTFIELD}
          label="콜레스테롤"
        />
        <TextField
          size="small"
          name="TransFat"
          autoFocus
          sx={TEXTFIELD}
          label="트렌스지방"
        />
        <TextField
          size="small"
          name="Caffeine"
          autoFocus
          sx={TEXTFIELD}
          label="카페인"
        />
        <TextField
          size="small"
          name="SaturatedFat"
          autoFocus
          sx={TEXTFIELD}
          label="포화지방"
        />
        <TextField
          size="small"
          name="DefaultSize"
          autoFocus
          sx={TEXTFIELD}
          label="기준 사이즈"
        />
      </Box>
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={TITLE}>
          <h2>제품 사이즈 별 가격 (음료)</h2>
        </Box>
        <TextField
          size="small"
          name="Tall"
          autoFocus
          sx={TEXTFIELD}
          label="Tall"
        />
        <TextField
          size="small"
          name="Grande"
          autoFocus
          sx={TEXTFIELD}
          label="Grade"
        />
        <TextField
          size="small"
          name="Venti"
          placeholder="Venti"
          autoFocus
          sx={TEXTFIELD}
          label="Venti"
        />
      </Box>

      <Box sx={{ color: "#5498d8" }}>
        <Box sx={TITLE}>
          <h2>제품 가격 (디저트)</h2>
        </Box>
        <TextField
          size="small"
          name="Desert"
          autoFocus
          sx={TEXTFIELD}
          label="Desert"
        />
      </Box>
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={TITLE}>
          <h2>옵션</h2>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
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
      <Button type="submit" sx={CLOSE} variant="outlined">
        등록
      </Button>
    </form>
  );
};

export default MenuCreate;

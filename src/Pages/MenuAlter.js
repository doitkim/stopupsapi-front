import axios from "axios";
import { useEffect, useState } from "react";
import style from "../CSS/Home/MenuCreate.module.css";
const MenuAlter = ({ menu }) => {
  // 수정할 기존 상품의 정보를 받아서 표시하고 이후 바뀐 정보를 다시 저장
  // value 만 사용할 경우 input 값 수정이 불가
  // 제품 ID는 바뀌면 안되므로 disable 처리
  const [altMenu, setAltMenu] = useState({});

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
    });
  }, []);
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

    try {
      // 정보 수정후 등록
      await axios.post(process.env.REACT_APP_API + "/menu/alter", {
        Category,
        ProductId,
        Name,
        Image,
        Desc,
        Nutrient,
        Price,
      });
    } catch (error) {
      console.error(error);
    }
    e.target.email.value = "";
    e.target.password.value = "";
  };

  return (
    <form className={style.menuCreateForm} onSubmit={onSubmit}>
      <h1>제품 수정</h1>
      <input
        type="text"
        name="Category"
        placeholder="카테고리 (필수)"
        value={altMenu.Category}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="ProductId"
        placeholder="제품번호 (필수)"
        value={altMenu.ProductId}
        onChange={onChange}
        disabled
        required
      />
      <input
        type="text"
        name="Name"
        placeholder="제품 이름 (필수)"
        required
        value={altMenu.Name}
        onChange={onChange}
      />
      <input
        type="text"
        name="Image"
        placeholder="제품 이미지"
        value={altMenu.Image}
        onChange={onChange}
      />
      <input
        type="textarea"
        name="Desc"
        placeholder="제품 설명"
        value={altMenu.Desc}
        onChange={onChange}
      />
      <h2>제품 영양 성분</h2>
      <input
        type="text"
        name="kcal"
        placeholder="칼로리"
        value={altMenu.Kcal}
        onChange={onChange}
      />
      <input
        type="text"
        name="Carbohydrate"
        placeholder="탄수화물"
        value={altMenu.Carbohydrate}
        onChange={onChange}
      />
      <input
        type="text"
        name="Sugar"
        placeholder="당"
        value={altMenu.Sugar}
        onChange={onChange}
      />
      <input
        type="text"
        name="Na"
        placeholder="나트륨"
        value={altMenu.Na}
        onChange={onChange}
      />
      <input
        type="text"
        name="Protein"
        placeholder="단백질"
        value={altMenu.Protein}
        onChange={onChange}
      />
      <input
        type="text"
        name="Fat"
        placeholder="지방"
        value={altMenu.Fat}
        onChange={onChange}
      />
      <input
        type="text"
        name="Cholesterol"
        placeholder="콜레스테롤"
        value={altMenu.Cholesterol}
        onChange={onChange}
      />
      <input
        type="text"
        name="TransFat"
        placeholder="트렌스지방"
        value={altMenu.TransFat}
        onChange={onChange}
      />
      <input
        type="text"
        name="Caffeine"
        placeholder="카페인"
        value={altMenu.Caffeine}
        onChange={onChange}
      />
      <input
        type="text"
        name="SaturatedFat"
        placeholder="포화지방"
        value={altMenu.SaturatedFat}
        onChange={onChange}
      />
      <input
        type="text"
        name="DefaultSize"
        placeholder="기준 사이즈"
        value={altMenu.DefaultSize}
        onChange={onChange}
      />
      <h2>제품 사이즈 별 가격</h2>
      <input
        type="text"
        name="Tall"
        placeholder="Tall"
        value={altMenu.Tall}
        onChange={onChange}
      />
      <input
        type="text"
        name="Grande"
        placeholder="Grande"
        value={altMenu.Grande}
        onChange={onChange}
      />
      <input
        type="text"
        name="Venti"
        placeholder="Venti"
        value={altMenu.Venti}
        onChange={onChange}
      />
      <h2>제품 가격 (디저트)</h2>
      <input
        type="text"
        name="Desert"
        placeholder="Desert"
        value={altMenu.Desert}
        onChange={onChange}
      />
      <button>등록</button>
    </form>
  );
};

export default MenuAlter;

import axios from "axios";
import style from "../CSS/Home/MenuCreate.module.css";

const MenuCreate = ({ apiKey }) => {
  const menuCreate = async (e) => {
    // 메뉴 등록
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

    const res = await axios.get(apiKey + `&Category=분류&Name=${Name}`);

    if (res.data[0] === undefined || res.data[0].Name !== Name) {
      try {
        await axios.post(process.env.REACT_APP_API + "/menu/create", {
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
    } else {
      alert("이미 존재하는 제품입니다.");
    }
  };

  return (
    <form onSubmit={menuCreate} className={style.menuCreateForm}>
      <h1>제품 등록</h1>
      <input
        type="text"
        name="Category"
        placeholder="카테고리 (필수)"
        required
      />
      <input
        type="text"
        name="ProductId"
        placeholder="제품번호 (필수)"
        required
      />
      <input type="text" name="Name" placeholder="제품 이름 (필수)" required />
      <input type="text" name="Image" placeholder="제품 이미지" />
      <textarea type="text" name="Desc" placeholder="제품 설명" />
      <h2>제품 영양 성분</h2>
      <input type="text" name="kcal" placeholder="칼로리" />
      <input type="text" name="Carbohydrate" placeholder="탄수화물" />
      <input type="text" name="Sugar" placeholder="당류" />
      <input type="text" name="Na" placeholder="나트륨" />
      <input type="text" name="Protein" placeholder="단백질" />
      <input type="text" name="Fat" placeholder="지방" />
      <input type="text" name="Cholesterol" placeholder="콜레스테롤" />
      <input type="text" name="TransFat" placeholder="트렌스지방" />
      <input type="text" name="Caffeine" placeholder="카페인" />
      <input type="text" name="SaturatedFat" placeholder="포화지방" />
      <input type="text" name="DefaultSize" placeholder="기준 사이즈" />
      <h2>제품 사이즈 별 가격 (음료)</h2>
      <input type="text" name="Tall" placeholder="Tall" />
      <input type="text" name="Grande" placeholder="Grade" />
      <input type="text" name="Venti" placeholder="Venti" />
      <h2>제품 가격 (디저트)</h2>
      <input type="text" name="Desert" placeholder="Desert" />
      <button>등록</button>
    </form>
  );
};

export default MenuCreate;

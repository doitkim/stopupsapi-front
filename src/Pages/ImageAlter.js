import axios from "axios";
import { useEffect, useState } from "react";
import style from "../CSS/Home/MenuCreate.module.css";
const ImageAlter = ({ menu }) => {
  // 수정할 기존 상품의 정보를 받아서 표시하고 이후 바뀐 정보를 다시 저장
  // value 만 사용할 경우 input 값 수정이 불가
  // 제품 ID는 바뀌면 안되므로 disable 처리
  const [altImage, setAltImage] = useState({});
  useEffect(() => {
    setAltImage({
      ImageId: menu[0].ImageId,
      Name: menu[0].Name,
      Image: menu[0].Image,
      Desc: menu[0].Desc,
    });
  }, []);

  const onChange = (e) => {
    setAltImage(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const ImageId = e.target.Id.value;
    const Name = e.target.Name.value;
    const Image = e.target.Image.value;
    const Desc = e.target.Desc.value;

    try {
      // 정보 수정후 등록
      await axios.post(process.env.REACT_APP_API + "/image/alter", {
        ImageId,
        Name,
        Image,
        Desc,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className={style.menuCreateForm} onSubmit={onSubmit}>
      <h1>이미지 수정</h1>
      <input
        type="text"
        name="Id"
        placeholder="이미지 고유번호 (필수)"
        value={altImage.ImageId}
        onChange={onChange}
        disabled
      />
      <input
        type="text"
        name="Name"
        placeholder="이미지 이름 (필수)"
        value={altImage.Name}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="Image"
        placeholder="이미지 주소"
        value={altImage.Image}
        onChange={onChange}
      />
      <input
        type="text"
        name="Desc"
        placeholder="이미지 상세 정보"
        value={altImage.Desc}
        onChange={onChange}
      />
      <button>등록</button>
    </form>
  );
};

export default ImageAlter;

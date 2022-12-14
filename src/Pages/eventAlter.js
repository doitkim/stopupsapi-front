import axios from "axios";
import { useEffect, useState } from "react";
import style from "../CSS/Home/MenuCreate.module.css";
const EventAlter = ({ menu }) => {
  // 수정할 기존 상품의 정보를 받아서 표시하고 이후 바뀐 정보를 다시 저장
  // value 만 사용할 경우 input 값 수정이 불가
  // 제품 ID는 바뀌면 안되므로 disable 처리
  const [altEvent, setAltEvent] = useState({});
  useEffect(() => {
    setAltEvent({
      EventId: menu[0].EventId,
      Name: menu[0].Name,
      Image: menu[0].Image,
      Desc: menu[0].Desc,
    });
  }, []);

  const onChange = (e) => {
    setAltEvent(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("EventId", e.target.Id.value);
    formData.append("Name", e.target.Name.value);
    formData.append("Desc", e.target.Desc.value);
    formData.append("ImgFile", e.target.ImgFile.files[0]);

    try {
      // 정보 수정후 등록
      await axios.post(process.env.REACT_APP_API + "/event/alter", formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className={style.menuCreateForm} onSubmit={onSubmit}>
      <h1>이벤트 수정</h1>
      <input
        type="text"
        name="Id"
        placeholder="이벤트 고유번호 (필수)"
        value={altEvent.EventId}
        onChange={onChange}
        disabled
      />
      <input
        type="text"
        name="Name"
        placeholder="이벤트 이름 (필수)"
        value={altEvent.Name}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="Desc"
        placeholder="이벤트 상세 정보"
        value={altEvent.Desc}
        onChange={onChange}
      />
      <input
        type="text"
        name="Image"
        placeholder="이벤트 주소"
        value={altEvent.Image}
        onChange={onChange}
        disabled
      />
      <input
        type="file"
        name="ImgFile"
        accept="image/*"
        placeholder="이벤트파일"
      />
      <button>등록</button>
    </form>
  );
};

export default EventAlter;

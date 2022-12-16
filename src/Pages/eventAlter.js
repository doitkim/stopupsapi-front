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
      Date: menu[0].Date,
      EventId: menu[0].EventId,
      Title: menu[0].Title,
      Image: menu[0].Image,
      EventTime: menu[0].EventTime,
    });
  }, []);

  const onChange = (e) => {
    setAltEvent(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("EventId", e.target.Id.value);
    formData.append("Title", e.target.Title.value);
    formData.append("EventTime", e.target.EventTime.value);
    for (let i = 0; i < e.target.ImgFile.files.length; i++) {
      formData.append("file", e.target.ImgFile.files[i]);
    }

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
        name="작성일자"
        placeholder="작성일자"
        value={altEvent.Date}
        onChange={onChange}
        disabled
      />
      <input
        type="text"
        name="Id"
        placeholder="고유번호 (필수)"
        value={altEvent.EventId}
        onChange={onChange}
        disabled
      />
      <input
        type="text"
        name="Title"
        placeholder="제목 (필수)"
        value={altEvent.Title}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="EventTime"
        placeholder="기간"
        value={altEvent.EventTime}
        onChange={onChange}
        required
      />
      {menu[0].Image ? (
        <>
          {Object.values(menu[0].Image).map((e, idx) => {
            return (
              <img src={process.env.REACT_APP_API + e} key={idx} width={150} />
            );
          })}
        </>
      ) : null}

      <input
        type="file"
        name="ImgFile"
        accept="image/*"
        placeholder="이벤트파일"
        multiple
      />
      <button>등록</button>
    </form>
  );
};

export default EventAlter;

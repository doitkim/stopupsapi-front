import axios from "axios";
import { useState } from "react";
import style from "../CSS/Home/MenuCreate.module.css";

const EventCreate = ({ valid }) => {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const date = new Date();
  const Year = date.getFullYear();
  const Month = String(date.getMonth() + 1).padStart(2, "0");
  const dates = String(date.getDate()).padStart(2, "0");
  const dateString = `${Year}-${Month}-${dates}`;
  const onChange = (e) => {
    setTime(e.target.value);
  };

  const eventCreate = async (e) => {
    // 이벤트 등록
    e.preventDefault();
    valid.find((el) => {
      if (el.EventId === e.target.Id.value) {
        setMessage("이벤트 고유번호 중복 확인 바람");
      }
    });
    const formData = new FormData();
    formData.append("Date", e.target.작성일자.value);
    formData.append("Id", e.target.Id.value);
    formData.append("Title", e.target.Title.value);
    formData.append("EventTime", e.target.EventTime.value);
    for (let i = 0; i < e.target.ImgFile.files.length; i++) {
      formData.append("file", e.target.ImgFile.files[i]);
    }
    try {
      await axios.post(process.env.REACT_APP_API + "/event/create", formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={eventCreate} className={style.menuCreateForm}>
      <h1>이벤트 등록</h1>
      <input
        type="text"
        name="작성일자"
        placeholder="작성일자"
        value={dateString}
        onChange={onChange}
        disabled
      />
      <input
        type="text"
        name="Id"
        placeholder="이벤트 고유번호 (필수)"
        required
      />
      <input
        type="text"
        name="Title"
        placeholder="이벤트 제목 (필수)"
        required
      />
      <input type="text" name="EventTime" placeholder="이벤트 기간" required />
      <input
        type="file"
        name="ImgFile"
        accept="image/*"
        placeholder="이벤트파일"
        multiple
      />
      <button>등록</button>
      {message}
    </form>
  );
};

export default EventCreate;

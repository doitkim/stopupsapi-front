import axios from "axios";
import { useState } from "react";
import style from "../CSS/Home/MenuCreate.module.css";

const EventCreate = ({ valid, API }) => {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const date = new Date();
  const Year = date.getFullYear();
  const Month = String(date.getMonth() + 1).padStart(2, "0");
  const dates = String(date.getDate()).padStart(2, "0");
  const dateString = `${Year}-${Month}-${dates}`;
  const [proceed, setProceed] = useState("");

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
    formData.append("Proceed", proceed);
    for (let i = 0; i < e.target.ImgFile.files.length; i++) {
      formData.append("file", e.target.ImgFile.files[i]);
    }
    try {
      await axios.post(API + "/event/create", formData);
    } catch (error) {
      console.error(error);
    }
  };

  const proceedState = (e) => {
    e.preventDefault();
    setProceed("진행중");
  };

  const endProceedState = (e) => {
    e.preventDefault();
    setProceed("종료");
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
      <span>
        {proceed === "진행중" ? (
          <button
            onClick={proceedState}
            style={{ backgroundColor: "#1e3932", color: "white" }}
          >
            진행중
          </button>
        ) : (
          <button onClick={proceedState}>진행중</button>
        )}
        {proceed === "종료" ? (
          <button
            onClick={endProceedState}
            style={{ backgroundColor: "#1e3932", color: "white" }}
          >
            종료
          </button>
        ) : (
          <button onClick={endProceedState}>종료</button>
        )}
      </span>
      <button>등록</button>
      {message}
    </form>
  );
};

export default EventCreate;

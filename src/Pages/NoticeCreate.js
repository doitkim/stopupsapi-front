import axios from "axios";
import { useState } from "react";
import style from "../CSS/Home/Notice.module.css";

const NoticeCreate = ({ valid, API }) => {
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

  const onSubmit = async (e) => {
    e.preventDefault();
    valid.find((el) => {
      if (el.Title === e.target.제목.value) {
        setMessage("공지사항 제목 중복 확인 바람");
      }
    });
    const writeDate = e.target.작성일자.value;
    const writeTitle = e.target.제목.value;
    const writeContent = e.target.내용.value;
    const writeId = e.target.게시글ID.value;
    const writeIndex = e.target.글번호.value;

    try {
      await axios.post(API + "/notice/create", {
        writeDate,
        writeTitle,
        writeContent,
        writeId,
        writeIndex,
      });
    } catch (error) {
      console.error(error);
    }
  };

  let count = 1;
  return (
    <form onSubmit={onSubmit} className={style.noticeForm}>
      <h1>공지 사항 등록</h1>
      <input
        type="text"
        placeholder="게시글 ID"
        name="게시글ID"
        value={Date.now() + count++}
        disabled
      />
      <input
        type="text"
        name="작성일자"
        placeholder="작성일자"
        value={dateString}
        onChange={onChange}
        disabled
      />
      <input type="text" placeholder="글번호" name="글번호" />
      <input type="text" placeholder="제목" name="제목" />
      <textarea placeholder="내용" name="내용" />
      <span>
        <button>등록</button>
      </span>
      {message}
    </form>
  );
};

export default NoticeCreate;

import axios from "axios";
import { useState } from "react";
import style from "../CSS/Home/Notice.module.css";

const NoticeCreate = ({ apiKey }) => {
  const [time, setTime] = useState("");
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
    const writeDate = e.target.작성일자.value;
    const writeTitle = e.target.제목.value;
    const writeContent = e.target.내용.value;
    const writeId = e.target.게시글ID.value;
    await axios.post(process.env.REACT_APP_API + "/notice/create", {
      writeDate,
      writeTitle,
      writeContent,
      writeId,
    });
  };
  let count = 1;
  return (
    <form onSubmit={onSubmit} className={style.noticeForm}>
      <h1>공지 사항 등록</h1>
      <input
        type="text"
        name="작성일자"
        placeholder="작성일자"
        value={dateString}
        onChange={onChange}
        disabled
      />
      <input type="text" placeholder="제목" name="제목" />
      <textarea placeholder="내용" name="내용" />
      <input
        type="text"
        placeholder="게시글 ID"
        name="게시글ID"
        value={Date.now() + count++}
        disabled
      />
      <span>
        <button>등록</button>
      </span>
    </form>
  );
};

export default NoticeCreate;

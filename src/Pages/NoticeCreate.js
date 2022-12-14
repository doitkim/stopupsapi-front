import axios from "axios";
import { useState } from "react";
import style from "../CSS/Home/Notice.module.css";

const NoticeCreate = ({ valid }) => {
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
    const formData = new FormData();
    formData.append("writeDate", e.target.작성일자.value);
    formData.append("writeTitle", e.target.제목.value);
    formData.append("writeContent", e.target.내용.value);
    formData.append("writeId", e.target.게시글ID.value);
    formData.append("writeImage", e.target.ImgFile.files[0]);

    try {
      await axios.post(process.env.REACT_APP_API + "/notice/create", formData);
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
      <input type="text" placeholder="제목" name="제목" />
      <textarea placeholder="내용" name="내용" />
      <input
        type="file"
        name="ImgFile"
        accept="image/*"
        placeholder="이미지파일"
      />
      <span>
        <button>등록</button>
      </span>
      {message}
    </form>
  );
};

export default NoticeCreate;

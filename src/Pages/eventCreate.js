import axios from "axios";
import { useState } from "react";
import style from "../CSS/Home/MenuCreate.module.css";

const EventCreate = ({ valid }) => {
  const [message, setMessage] = useState("");

  const eventCreate = async (e) => {
    // 이벤트 등록
    e.preventDefault();

    valid.find((el) => {
      if (el.EventId === e.target.Id.value) {
        setMessage("이벤트 고유번호 중복 확인 바람");
      }
    });
    const formData = new FormData();
    formData.append("Id", e.target.Id.value);
    formData.append("Name", e.target.Name.value);
    formData.append("Desc", e.target.Desc.value);
    formData.append("file", e.target.ImgFile.files[0]);
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
        name="Id"
        placeholder="이벤트 고유번호 (필수)"
        required
      />
      <input
        type="text"
        name="Name"
        placeholder="이벤트 이름 (필수)"
        required
      />
      <textarea name="Desc" placeholder="이벤트 내용" />
      <input
        type="file"
        name="ImgFile"
        accept="image/*"
        placeholder="이벤트파일"
      />
      <button>등록</button>
      {message}
    </form>
  );
};

export default EventCreate;

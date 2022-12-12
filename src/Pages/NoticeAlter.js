import axios from "axios";
import { useEffect, useState } from "react";
import style from "../CSS/Home/MenuCreate.module.css";

const NoticeAlter = ({ menu }) => {
  const [altNotice, setAltNotice] = useState({});

  useEffect(() => {
    setAltNotice({
      Date: menu[0].Date,
      Title: menu[0].Title,
      Desc: menu[0].Desc,
      Id: menu[0].Id,
    });
  }, []);

  const onChange = (e) => {
    setAltNotice(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // 정보 수정후 등록
      await axios.post(process.env.REACT_APP_API + "/notice/alter", {
        Title: e.target.Title.value,
        Desc: e.target.Desc.value,
        Id: e.target.Id.value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className={style.menuCreateForm} onSubmit={onSubmit}>
      <h1>공지 수정</h1>
      <input
        type="text"
        name="Date"
        placeholder="작성 일자"
        value={altNotice.Date}
        onChange={onChange}
        disabled
      />
      <input
        type="text"
        name="Title"
        placeholder="제목 (필수)"
        value={altNotice.Title}
        onChange={onChange}
        required
      />
      <textarea
        name="Desc"
        placeholder="내용 (필수)"
        required
        value={altNotice.Desc}
        onChange={onChange}
      />
      <input
        type="text"
        name="Id"
        placeholder="게시글Id"
        required
        value={altNotice.Id}
        onChange={onChange}
        disabled
      />
      <button>등록</button>
    </form>
  );
};

export default NoticeAlter;

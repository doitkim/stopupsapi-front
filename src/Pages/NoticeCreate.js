import axios from "axios";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NoticeCreate = ({ valid, API }) => {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const date = new Date();
  const Year = date.getFullYear();
  const Month = String(date.getMonth() + 1).padStart(2, "0");
  const dates = String(date.getDate()).padStart(2, "0");
  const dateString = `${Year}-${Month}-${dates}`;
  const navigate = useNavigate();

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
      await axios
        .post(API + "/notice/create", {
          writeDate,
          writeTitle,
          writeContent,
          writeId,
          writeIndex,
        })
        .then(navigate("/"));
    } catch (error) {
      console.error(error);
    }
  };

  const NOTICECREATE = {
    padding: 10,
    backgroundColor: "#b5e4fb",
    width: 800,
    minWidth: 780,
  };
  const TEXTFEILD = {
    m: 1,
    "& .MuiOutlinedInput-root": {
      "& > fieldset": { borderColor: "#316ca4" },
    },
    "& .MuiOutlinedInput-root:hover": {
      "& > fieldset": {
        borderColor: "#1877d5",
      },
    },
  };
  const ENROLL = { m: 1, color: "#5498d8", borderColor: "#1877d5" };
  let count = 1;
  return (
    <form onSubmit={onSubmit} style={NOTICECREATE}>
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={{ bgcolor: "#316ca4" }}>
          <h1>공지 사항 등록</h1>
        </Box>
        <TextField
          name="게시글ID"
          value={Date.now() + count++}
          required
          disabled
          size="small"
          autoFocus
          sx={TEXTFEILD}
          label="게시글 ID"
        />
        <TextField
          name="작성일자"
          value={dateString}
          onChange={onChange}
          disabled
          required
          size="small"
          autoFocus
          sx={TEXTFEILD}
          label="작성일자"
        />
        <TextField
          name="글번호"
          required
          size="small"
          autoFocus
          sx={TEXTFEILD}
          label="글번호"
        />
        <TextField
          name="제목"
          required
          size="small"
          autoFocus
          sx={TEXTFEILD}
          label="제목"
        />
        <TextField
          name="내용"
          required
          size="small"
          autoFocus
          sx={TEXTFEILD}
          label="내용"
        />
        <span>
          <Button type="submit" sx={ENROLL} variant="outlined">
            등록
          </Button>
        </span>
        {message}
      </Box>
    </form>
  );
};

export default NoticeCreate;

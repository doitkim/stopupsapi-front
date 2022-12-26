import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const NoticeAlter = ({ menu, API }) => {
  const [altNotice, setAltNotice] = useState({});

  useEffect(() => {
    setAltNotice({
      Date: menu[0].Date,
      Title: menu[0].Title,
      Desc: menu[0].Desc,
      Id: menu[0].Id,
      Num: menu[0].Num,
    });
  }, []);

  const onChange = (e) => {
    setAltNotice(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const Title = e.target.Title.value;
    const Desc = e.target.Desc.value;
    const Id = e.target.Id.value;
    const Num = e.target.Num.value;
    try {
      // 정보 수정후 등록
      await axios.post(API + "/notice/alter", {
        Title,
        Desc,
        Id,
        Num,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const NOTICEALTER = {
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
  return (
    <form onSubmit={onSubmit} style={NOTICEALTER}>
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={{ bgcolor: "#316ca4" }}>
          <h1>공지 수정</h1>
        </Box>
        <TextField
          size="small"
          name="Num"
          required
          value={altNotice.Num}
          onChange={onChange}
          autoFocus
          sx={TEXTFEILD}
          label="글번호"
        />
        <TextField
          size="small"
          name="Id"
          required
          value={altNotice.Id}
          onChange={onChange}
          disabled
          autoFocus
          sx={TEXTFEILD}
          label="게시글Id"
        />
        <TextField
          size="small"
          name="Title"
          value={altNotice.Title}
          onChange={onChange}
          required
          autoFocus
          sx={TEXTFEILD}
          label="제목"
        />
        <TextField
          size="small"
          name="Desc"
          required
          value={altNotice.Desc}
          onChange={onChange}
          autoFocus
          sx={TEXTFEILD}
          label="내용"
        />
        <TextField
          size="small"
          name="Date"
          placeholder="작성 일자"
          value={altNotice.Date}
          onChange={onChange}
          disabled
          autoFocus
          sx={TEXTFEILD}
          label="작성 일자"
        />
        <Button type="submit" sx={ENROLL} variant="outlined">
          등록
        </Button>
      </Box>
    </form>
  );
};

export default NoticeAlter;

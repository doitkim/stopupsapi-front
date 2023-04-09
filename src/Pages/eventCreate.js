import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EventCreate = ({ valid, API }) => {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const date = new Date();
  const Year = date.getFullYear();
  const Month = String(date.getMonth() + 1).padStart(2, "0");
  const dates = String(date.getDate()).padStart(2, "0");
  const dateString = `${Year}-${Month}-${dates}`;
  const [proceed, setProceed] = useState("");
  const navigate = useNavigate();

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
      await axios.post(API + "/event/create", formData).then(navigate("/"));
    } catch (error) {
      console.error(error);
    }
  };
  const CREATEFORM = { width: 800, padding: 10, backgroundColor: "#b5e4fb" };
  const TEXTFIELD = {
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
  const PRCEED = { m: 1, color: "white", bgcolor: "#1877d5" };
  const END = { m: 1, color: "#5498d8", borderColor: "#1877d5" };

  const proceedState = (e) => {
    e.preventDefault();
    setProceed("진행중");
  };

  const endProceedState = (e) => {
    e.preventDefault();
    setProceed("종료");
  };

  return (
    <form onSubmit={eventCreate} style={CREATEFORM}>
      <Box sx={{ color: "#5498d8" }}>
        <TextField
          name="작성일자"
          value={dateString}
          onChange={onChange}
          required
          disabled
          size="small"
          autoFocus
          sx={TEXTFIELD}
          label="작성일자"
        />
        <TextField
          name="Id"
          required
          size="small"
          autoFocus
          sx={TEXTFIELD}
          label="고유번호"
        />
        <TextField
          name="Title"
          required
          size="small"
          autoFocus
          sx={TEXTFIELD}
          label="제목"
        />
        <TextField
          name="EventTime"
          placeholder="이벤트 기간"
          required
          size="small"
          autoFocus
          sx={TEXTFIELD}
          label="이벤트 기간"
        />
        <input
          type="file"
          name="ImgFile"
          accept="image/*"
          multiple
          size="small"
          autoFocus
          sx={TEXTFIELD}
        />
        <span>
          {proceed === "진행중" ? (
            <Button onClick={proceedState} sx={PRCEED}>
              진행중
            </Button>
          ) : (
            <Button
              type="submit"
              sx={END}
              variant="outlined"
              onClick={proceedState}
            >
              진행중
            </Button>
          )}
          {proceed === "종료" ? (
            <Button onClick={endProceedState} sx={PRCEED}>
              종료
            </Button>
          ) : (
            <Button
              type="submit"
              sx={END}
              variant="outlined"
              onClick={endProceedState}
            >
              종료
            </Button>
          )}
        </span>
        <Button type="submit" sx={END} variant="outlined">
          등록
        </Button>
        {message}
      </Box>
    </form>
  );
};

export default EventCreate;

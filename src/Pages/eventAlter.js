import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const EventAlter = ({ menu, API }) => {
  // 수정할 기존 상품의 정보를 받아서 표시하고 이후 바뀐 정보를 다시 저장
  // value 만 사용할 경우 input 값 수정이 불가
  // 제품 ID는 바뀌면 안되므로 disable 처리
  const [altEvent, setAltEvent] = useState({});
  const [proceed, setProceed] = useState("");

  useEffect(() => {
    setAltEvent({
      Date: menu[0].Date,
      EventId: menu[0].EventId,
      Title: menu[0].Title,
      Image: menu[0].Image,
      EventTime: menu[0].EventTime,
    });
  }, []);

  const onChange = (e) => {
    setAltEvent(e.target.value);
  };

  const proceedState = (e) => {
    e.preventDefault();
    setProceed("진행중");
  };

  const endProceedState = (e) => {
    e.preventDefault();
    setProceed("종료");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("EventId", e.target.Id.value);
    formData.append("Title", e.target.Title.value);
    formData.append("EventTime", e.target.EventTime.value);
    formData.append("Proceed", proceed);
    for (let i = 0; i < e.target.ImgFile.files.length; i++) {
      formData.append("file", e.target.ImgFile.files[i]);
    }

    try {
      // 정보 수정후 등록
      await axios.post(API + "/event/alter", formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 10,
        backgroundColor: "#b5e4fb",
      }}
    >
      <Box sx={{ color: "#5498d8" }}>
        <Box sx={{ bgcolor: "#316ca4", width: "60vw" }}>
          <h1>이벤트 수정</h1>
        </Box>
        <TextField
          size="small"
          name="작성일자"
          required
          autoFocus
          sx={{
            m: 1,
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: "#316ca4" },
            },
            "& .MuiOutlinedInput-root:hover": {
              "& > fieldset": {
                borderColor: "#1877d5",
              },
            },
          }}
          label="작성일자"
          value={altEvent.Date}
          onChange={onChange}
          disabled
        />
        <TextField
          size="small"
          name="Id"
          required
          autoFocus
          sx={{
            m: 1,
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: "#316ca4" },
            },
            "& .MuiOutlinedInput-root:hover": {
              "& > fieldset": {
                borderColor: "#1877d5",
              },
            },
          }}
          label="고유번호"
          value={altEvent.EventId}
          onChange={onChange}
          disabled
        />
        <TextField
          size="small"
          name="Title"
          autoFocus
          sx={{
            m: 1,
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: "#316ca4" },
            },
            "& .MuiOutlinedInput-root:hover": {
              "& > fieldset": {
                borderColor: "#1877d5",
              },
            },
          }}
          label="제목"
          value={altEvent.Title}
          onChange={onChange}
          required
        />
        <TextField
          size="small"
          name="EventTime"
          autoFocus
          sx={{
            m: 1,
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: "#316ca4" },
            },
            "& .MuiOutlinedInput-root:hover": {
              "& > fieldset": {
                borderColor: "#1877d5",
              },
            },
          }}
          label="기간"
          value={altEvent.EventTime}
          onChange={onChange}
          required
        />
        <Box
          sx={{
            p: 1,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignContent: "center",
            justifyContent: "flexStart",
          }}
        >
          {menu[0].Image ? (
            <>
              {Object.values(menu[0].Image).map((e, idx) => {
                return <img src={API + e} key={idx} width={150} />;
              })}
            </>
          ) : null}
        </Box>
        <input
          type="file"
          name="ImgFile"
          accept="image/*"
          placeholder="이벤트파일"
          multiple
        />
        <span>
          {proceed === "진행중" ? (
            <Button
              onClick={proceedState}
              sx={{
                m: 1,
                color: "white",
                bgcolor: "#1877d5",
              }}
            >
              진행중
            </Button>
          ) : (
            <Button
              sx={{ m: 1, color: "#5498d8", borderColor: "#1877d5" }}
              variant="outlined"
              onClick={proceedState}
            >
              진행중
            </Button>
          )}
          {proceed === "종료" ? (
            <Button
              onClick={endProceedState}
              sx={{
                m: 1,
                color: "white",
                bgcolor: "#1877d5",
              }}
            >
              종료
            </Button>
          ) : (
            <Button
              sx={{ m: 1, color: "#5498d8", borderColor: "#1877d5" }}
              variant="outlined"
              onClick={endProceedState}
            >
              종료
            </Button>
          )}
        </span>
        <Button
          type="submit"
          sx={{ m: 1, color: "#5498d8", borderColor: "#1877d5" }}
          variant="outlined"
        >
          등록
        </Button>
      </Box>
    </form>
  );
};

export default EventAlter;

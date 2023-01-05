import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { encrypt, decrypt } from "../Crypto/chiper"; // DB에 저장 시 암호화, 조회시 복호화
import { useNavigate } from "react-router-dom"; // 회원 가입 취소 및 페이지 렌더링 시 사용
import { useState } from "react";
import { Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const API = process.env.REACT_APP_API;
const theme = createTheme();
const FindPw = () => {
  const navigate = useNavigate(); // 페이지 렌더링에 이용
  const [rnd, setRnd] = useState(""); // 임의의 비밀번호 4자리 값 저장
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [regEmail, setRegEmail] = useState(false);
  const [regPhone, setRegPhone] = useState(false);
  const RULEID = process.env.REACT_APP_RULE_ID;
  const RULEHP = process.env.REACT_APP_RULE_HP;
  const RULEPW = process.env.REACT_APP_RULE_PW;
  const regexId = new RegExp(RULEID);
  const regexHP = new RegExp(RULEHP);

  const onChangeEmail = (e) => {
    setRegEmail(regexId.test(e.target.value));
  };

  const onChangePhone = (e) => {
    setRegPhone(regexHP.test(e.target.value));
  };

  const chpassword = async (e) => {
    const chpw =
      e.target.parentElement.children[0].children[1].children[0].value;
    let regexPW = new RegExp(RULEPW);
    if (regexPW.test(chpw)) {
      const eUserPhoneNumber = userInfo.userPhoneNumber;
      const eUserId = userInfo.userId;
      const eUserPw = encrypt(chpw);
      try {
        // 회원 정보 업데이트
        await axios.post(API + "/users/update", {
          eUserId,
          eUserPw,
          eUserPhoneNumber,
        });
        navigate("/"); // 로그인 페이지로 이동
      } catch (error) {
        console.error(error);
      }
    }
  };
  const smsAuth = (e) => {
    e.preventDefault();

    if (
      rnd === e.target.parentElement.children[0].children[1].children[0].value
    ) {
      alert("인증 성공");
      setAuth(!auth);
      setPassword(!password);
    }
  };

  const handleClickShowPhoneNumber = () => setShowPhoneNumber((show) => !show);
  const handleMouseDownPhoneNumber = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let regexId = new RegExp(RULEID);
    let regexHP = new RegExp(RULEHP);
    // 아이디 패스워드 값 저장
    const userId = e.target.email.value;
    const phone_number = e.target.phoneNumber.value;
    const rnd_number = Math.floor(Math.random() * 8999) + 1000; // 임의의 인증 번호 생성
    setRnd(rnd_number.toString()); // 인증 번호 문자열로 저장

    if (regexId.test(userId) && regexHP.test(phone_number)) {
      // DB 계정 정보 조회
      const res = await axios.get(API + "/users");
      const users = res.data;
      // 암호화된 DB의 계정 정보와 사용자 계정정보가 같은지 확인
      const found =
        users.find((element) => decrypt(element.userId) === userId) &&
        users.find(
          (element) => decrypt(element.userPhoneNumber) === phone_number
        );
      setUserInfo(found);
      if (found) {
        await axios.post(API + `/sms/`, {
          phone_number,
          rnd_number,
        });
        setAuth(!auth);
      }
      e.target.phoneNumber.value = "";
      e.target.email.value = "";
    }
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: "27.6vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "28.5vh",
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "secondary.main", bgcolor: "#1c75cf" }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              비밀번호 재설정
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="이메일"
                    name="email"
                    autoComplete="email"
                    onChange={onChangeEmail}
                  />
                </Grid>
                {regEmail ? null : (
                  <Grid item xs={12}>
                    <Alert severity="error">올바른 형식을 사용하세요.</Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phoneNumber"
                    label="phoneNumber"
                    type={showPhoneNumber ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPhoneNumber}
                            onMouseDown={handleMouseDownPhoneNumber}
                          >
                            {showPhoneNumber ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={onChangePhone}
                  />
                </Grid>
                {regPhone ? null : (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      올바른 형식을 사용하세요. ex) 01012341234
                    </Alert>
                  </Grid>
                )}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                비밀번호 재설정
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mb: 3,
                }}
                onClick={() => navigate("/")}
              >
                취소
              </Button>
              {auth ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "stretch",
                  }}
                >
                  <TextField
                    size="small"
                    required
                    fullWidth
                    label="인증번호"
                    type="password"
                  />
                  <Button variant="contained" onClick={smsAuth}>
                    전송
                  </Button>
                </Box>
              ) : null}
              {password ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "stretch",
                  }}
                >
                  <TextField
                    size="small"
                    fullWidth
                    required
                    label="비밀번호재설정"
                    type="password"
                  />
                  <Button variant="contained" onClick={chpassword}>
                    전송
                  </Button>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default FindPw;

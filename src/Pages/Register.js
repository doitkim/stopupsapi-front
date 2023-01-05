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
import { Link, useNavigate } from "react-router-dom"; // 회원 가입 취소 및 페이지 렌더링 시 사용
import { useState } from "react";
import { Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const API = process.env.REACT_APP_API;
const theme = createTheme();
const RULEID = process.env.REACT_APP_RULE_ID;
const RULEPW = process.env.REACT_APP_RULE_PW;
const RULEHP = process.env.REACT_APP_RULE_HP;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [regEmail, setRegEmail] = useState(false);
  const [regPassword, setRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPhoneNumber = () => setShowPhoneNumber((show) => !show);
  const handleMouseDownPhoneNumber = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate(); // 페이지 렌더링에 이용
  const onChangeEmail = (e) => {
    setRegEmail(regexId.test(e.target.value));
  };
  const onChangePassword = (e) => {
    setRegPassword(regexPW.test(e.target.value));
  };
  const onChangePhone = (e) => {
    setRegPhone(regexHP.test(e.target.value));
  };

  const regexId = new RegExp(RULEID);
  const regexPW = new RegExp(RULEPW);
  const regexHP = new RegExp(RULEHP);
  const onSubmit = async (e) => {
    e.preventDefault();
    let accessToken = Math.floor(Date.now() + Math.random() * 100 + 100); // 회원가입 시 accessToken 생성
    accessToken = accessToken.toString(); // 문자열로 변환
    // 아이디 패스워드 값 저장
    const userId = e.target.email.value;
    const userPw = e.target.password.value;
    const phoneNumber = e.target.phoneNumber.value;

    if (
      regexId.test(userId) &&
      regexPW.test(userPw) &&
      regexHP.test(phoneNumber)
    ) {
      // 시그니처 문자가 포함된 난수를 저장
      const userApi = "TeamYN" + Math.floor(Date.now() + Math.random() * 1000);
      // 암호화된 정보들
      const eAccessToken = encrypt(accessToken);
      const eUserId = encrypt(userId);
      const eUserPw = encrypt(userPw);
      const eUserApi = encrypt(userApi);
      const eUserPhoneNumber = encrypt(phoneNumber);
      // DB 계정 정보 조회
      const res = await axios.get(API + "/users");
      const users = res.data;
      // 암호화된 DB의 계정 정보와 사용자 계정정보가 같은지 확인
      const found = users.find((element) => decrypt(element.userId) === userId);
      if (userId !== "" && userPw !== "" && found) {
        // 아이디, 비밀번호가 공백이 아니고 DB에 계정이 존재하면
        alert("이미 가입된 관리자 계정입니다.");
        window.location.reload();
      } else {
        try {
          // POST로 암호화된 회원가입 정보 전달
          await axios.post(API + "/users", {
            eAccessToken,
            eUserId,
            eUserPw,
            eUserPhoneNumber,
            eUserApi,
          });
          navigate("/"); // 로그인 페이지로 이동
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      alert("올바른 형식이 아닙니다.");
      // 사용자 입력값 초기화
      window.location.reload();
    }
  };
  const WRAP = {
    marginTop: "24.7vh",
    marginBottom: "28.3vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const AVARTAR = {
    m: 1,
    bgcolor: "secondary.main",
    bgcolor: "#1c75cf",
  };
  const LINK = {
    textDecoration: "none",
    color: "#1c75ce",
    fontWeight: "bold",
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={WRAP}>
            <Avatar sx={AVARTAR}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              회원가입
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
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    onChange={onChangePassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {regPassword ? null : (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phoneNumber"
                    label="phoneNumber"
                    type={showPhoneNumber ? "text" : "password"}
                    autoComplete="phoneNumber"
                    onChange={onChangePhone}
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
                회원가입
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/" variant="body2" style={LINK}>
                    이미 계정이 있으신가요?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Register;

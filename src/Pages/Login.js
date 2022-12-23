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
import { decrypt } from "../Crypto/chiper";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const theme = createTheme();
const RULEID = process.env.REACT_APP_RULE_ID;
const RULEPW = process.env.REACT_APP_RULE_PW;
let regexId = new RegExp(RULEID);
let regexPW = new RegExp(RULEPW);

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false); // 로그인 상태 저장
  useEffect(() => {
    // 세션 스토리지에 accessToken 키의 Value가 존재시
    if (sessionStorage.getItem("accessToken")) {
      setIsLogin(!isLogin); // 로그인 상태 설정
    }
    if (isLogin) {
      navigate("/home"); // 로그인 상태면 홈으로 이동
    }
  }, [isLogin]); // 로그인 상태값 바뀔 때마다 반응
  const loginSubmit = async (e) => {
    e.preventDefault(); // Submit 기본 새로고침 막음
    // DOM의 태그들의 이름의 값 저장
    const userId = e.target.email.value;
    const userPw = e.target.password.value;
    const API = process.env.REACT_APP_API;
    if (regexId.test(userId) && regexPW.test(userPw)) {
      // 유저 정보 조회
      const res = await axios.get(API + "/users");
      const users = res.data;
      // 유저 인증 (DB에 암호화 되어있는 데이터를 복호화 해서 비교)
      users.find((element) => {
        if (
          decrypt(element.userId) === userId &&
          decrypt(element.userPw) === userPw
        ) {
          sessionStorage.setItem("accessToken", element.userToken);
          navigate("/home");
        }
      });
      // 이후 input에 남아있는 값 초기화
      e.target.email.value = "";
      e.target.password.value = "";
    } else {
      alert("올바른 형식이 아닙니다.");
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "secondary.main", bgcolor: "#1c75cf" }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              로그인
            </Typography>
            <Box
              component="form"
              onSubmit={loginSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="이메일"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
              >
                로그인
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    to="/findPw"
                    variant="body2"
                    style={{
                      textDecoration: "none",
                      color: "#1c75ce",
                      fontWeight: "bold",
                    }}
                  >
                    비밀번호 찾기
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    to="/register"
                    variant="body2"
                    style={{
                      textDecoration: "none",
                      color: "#1c75ce",
                      fontWeight: "bold",
                    }}
                  >
                    회원가입
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

export default Login;

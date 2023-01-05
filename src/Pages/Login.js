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
import { decrypt } from "../Crypto/chiper"; // 복호화 모듈 호출
import { Link, useNavigate } from "react-router-dom"; // 렌더링 없이 화면 이동 하기 위해 사용
import { useEffect, useState } from "react"; // 조건 부 렌더링 및 상태 값 저장
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const theme = createTheme(); // MUI 테마 사용
const RULEID = process.env.REACT_APP_RULE_ID; // ID 룰 (이메일 형식)
const RULEPW = process.env.REACT_APP_RULE_PW; // PW룰 (8~16자 특수문자 포함 대소문자 포함)
let regexId = new RegExp(RULEID); // 검증
let regexPW = new RegExp(RULEPW); // 검증

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false); // 로그인 상태 저장
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
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
    const userId = e.target.email.value; // 사용자 이메일 입력
    const userPw = e.target.password.value; // 사용자 비밀번호 입력
    const API = process.env.REACT_APP_API; // 사용자 할당 API 키
    // 입력한 사용자 정보 형식 검증
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
      alert("아이디 또는 비밀번호를 잘못 입력했습니다.");
    }
  };
  const LOGINBOX = {
    marginTop: "24.7vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "34.5vh",
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
          <Box sx={LOGINBOX}>
            <Avatar sx={AVARTAR}>
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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
                  <Link to="/findPw" variant="body2" style={LINK}>
                    비밀번호 재설정
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/register" variant="body2" style={LINK}>
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

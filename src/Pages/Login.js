import axios from "axios";
import style from "../CSS/Login/Login.module.css";
import { decrypt } from "../Crypto/chiper";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

    // 유저 정보 조회
    const res = await axios.get(process.env.REACT_APP_API + "/users");
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
  };
  return (
    <form onSubmit={loginSubmit} className={style.loginForm}>
      <h1>스탑없으 API 서비스</h1>
      {/* 타입에 email일 경우 이메일 형식 지켜야함 */}
      <input
        className={style.loginFormInput}
        type="email"
        name="email"
        placeholder="email"
        required
      />
      {/* 비밀번호는 정규표현식을 패턴값으로 적용 html 태그 속성에 보인다는게 단점 */}
      <input
        className={style.loginFormInput}
        type="password"
        name="password"
        placeholder="영문,대소문자,숫자,특수문자 포함 8~16자"
        required
        pattern="^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$"
      />
      <button className={style.loginFormButton} type="submit">
        로그인
      </button>
      {/* 링크를 이용하여 회원가입 페이지 이동 */}
      <Link to="/register">아직 회원이 아니신가요?</Link>
    </form>
  );
};

export default Login;

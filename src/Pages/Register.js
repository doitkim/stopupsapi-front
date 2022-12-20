import axios from "axios";
import style from "../CSS/Register/Register.module.css";
import { encrypt, decrypt } from "../Crypto/chiper"; // DB에 저장 시 암호화, 조회시 복호화
import { Link, useNavigate } from "react-router-dom"; // 회원 가입 취소 및 페이지 렌더링 시 사용
import { useState } from "react"; // 상태 값 저장
const API = process.env.REACT_APP_API;

const Register = () => {
  const navigate = useNavigate(); // 페이지 렌더링에 이용
  const [message, setMessage] = useState(""); // 회원 가입시 중복된 계정이 있으면 표출
  const onSubmit = async (e) => {
    e.preventDefault();
    let accessToken = Math.floor(Date.now() + Math.random() * 100 + 100); // 회원가입 시 accessToken 생성
    accessToken = accessToken.toString(); // 문자열로 변환

    // 아이디 패스워드 값 저장
    const userId = e.target.email.value;
    const userPw = e.target.password.value;
    const phoneNumber = e.target.phoneNumber.value;

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
      setMessage("이미 가입된 관리자 계정입니다.");

      // 사용자 입력 값 초기화
      e.target.email.value = "";
      e.target.password.value = "";
      e.target.phoneNumber.value = "";
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
      // 사용자 입력값 초기화
      e.target.email.value = "";
      e.target.password.value = "";
      e.target.phoneNumber.value = "";
    }
  };
  return (
    <>
      <form className={style.registerForm} onSubmit={onSubmit}>
        <h1>회원 가입</h1>
        {/* 이메일 형식을 사용해야하고 필수 항목 설정 */}
        <input
          className={style.registerFormInput}
          type="email"
          name="email"
          placeholder="email"
          required
        />
        {/* 정규표현식이 적용된 비밀번호 */}
        <input
          className={style.registerFormInput}
          type="password"
          name="password"
          placeholder="영문,대소문자,숫자,특수문자 포함 8~16자"
          required
          pattern="^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$"
        />
        <input
          className={style.registerFormInput}
          type="password"
          name="phoneNumber"
          placeholder="Your Phone Number"
          required
        />
        {/* 이미 사용된 계정시 오류 메세지 발생 */}
        {message}
        <span className={style.btnWrap}>
          <button className={style.registerFormButton}>회원 가입</button>
          <Link to="/">
            <button className={style.registerFormButton}>취소</button>
          </Link>
        </span>
      </form>
    </>
  );
};

export default Register;

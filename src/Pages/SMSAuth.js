import axios from "axios";
import { useState } from "react"; // 상태 값 저장
import { useNavigate } from "react-router-dom"; // 페이지 리렌더링 용도
import { decrypt } from "../Crypto/chiper";
import style from "../CSS/Home/SMSAuth.module.css";

const SMSAuth = () => {
  const [show, setShow] = useState(false); // 휴대전화 입력 여부 상태 저장
  const [rnd, setRnd] = useState(""); // 임의의 비밀번호 4자리 값 저장
  const [authForm, setAuthForm] = useState(false); // 인증 상태 값 저장
  const navigate = useNavigate(); // 페이지 리렌더링 용도
  const phoneSubmit = async (e) => {
    // SMS 인증
    e.preventDefault();
    const phone_number = e.target.phone_number.value; // 휴대전화 번호
    const res = await axios.get(process.env.REACT_APP_API + `/users`);
    const userInfo = res.data;

    userInfo.map(async (user) => {
      if (phone_number === decrypt(user.userPhoneNumber)) {
        const rnd_number = Math.floor(Math.random() * 8999) + 1000; // 임의의 인증 번호 생성
        setRnd(rnd_number.toString()); // 인증 번호 문자열로 저장
        if (phone_number !== "") {
          // 값이 존재하면 SMS 인증을 위해 POST로 전달
          await axios.post(process.env.REACT_APP_API + `/sms/`, {
            phone_number,
            rnd_number,
          });
          e.target.phone_number.value = ""; // 입력 정보 값 초기화
        }
        setShow(!show); // 휴대전화 인증 토글 변경
      }
    });
  };

  // 모바일 인증
  const authSubmit = (e) => {
    e.preventDefault();
    const userAuth = e.target.phone_number.value; // 인증 번호 값 저장
    e.target.phone_number.value = ""; // 인증 번호 입력 값 초기화
    if (userAuth === rnd) {
      // 사용자에게 보낸 임의의 4자리와 사용자가 입력한 4자리가 맞으면 작동
      setAuthForm(true); // 인증 값 설정
      sessionStorage.setItem("AuthForm", "success"); // 세션 스토리지에 인증 여부 저장
      navigate("/"); // 페이지 리렌더링 하기 위한 페이지 이동
    }
    setShow(!show); // 인증 폼 상태값 변경
  };

  return (
    <>
      {/* 인증 여부에 따라 작동 */}
      {authForm ? (
        <>{alert("인증 완료")}</>
      ) : (
        <>
          {/* 모달 토글 상태에 따라 작동 */}
          {show ? (
            <form className={style.SMSAuth} onSubmit={authSubmit}>
              <input
                placeholder="인증 번호 인증"
                name="phone_number"
                required
              />
              <button>전송</button>
            </form>
          ) : (
            <form className={style.SMSAuth} onSubmit={phoneSubmit}>
              <input
                placeholder="휴대폰 번호 인증"
                name="phone_number"
                required
              />
              <button>전송</button>
            </form>
          )}
        </>
      )}
    </>
  );
};

export default SMSAuth;

import axios from "axios";
import { useEffect, useState } from "react"; // 상태값 설정
import CopyToClipboard from "react-copy-to-clipboard"; // 클립보드에 복사
import { useNavigate } from "react-router-dom"; // 로그아웃 시 로그인 페이지로 이동
import { decrypt } from "../Crypto/chiper"; // 복호화
import style from "../CSS/Home/Home.module.css";
import SMSAuth from "./SMSAuth"; // SMS 인증
import Modal from "react-modal"; // 메뉴 조회 모달
import MenuCreate from "./MenuCreate"; // 메뉴 등록
import MenuAlter from "./MenuAlter"; // 메뉴 수정
import EventCreate from "./eventCreate"; // 이벤트 등록
import EventAlter from "./eventAlter"; // 이벤트 수정
import NoticeCreate from "./NoticeCreate"; // 공지 등록
import NoticeAlter from "./NoticeAlter"; // 공지 수정
import MenuExcelDownload from "./MenuExcelDownload"; // 메뉴 엑셀 다운로드
import EventExcelDownload from "./eventExcelDownload"; // 이벤트 엑셀 다운로드
import NoticeExcelDownload from "./NoticeExcelDownload"; // 공지 엑셀 다운로드

const Home = () => {
  const [apiKey, setApiKey] = useState(""); // API 키 값 상태 저장
  const [smsAuth, setSmsAuth] = useState(false); // SMS 인증 상태 저장
  const [menuList, setMenuList] = useState({}); // 메뉴 조회시 메뉴 값 저장
  const [modal, setModal] = useState(false); // 메뉴 조회 모달 토글 상태 저장
  const [search, setSearch] = useState(""); // 사용자 검색 값 저장
  const [category, setCategory] = useState(""); // 사용자 카테고리 값 저장
  const [showMenuCreate, setShowMenuCreate] = useState(false); // 메뉴 등록 모달 토글
  const [menuInfo, setMenuInfo] = useState({}); // 메뉴 수정시 사용
  const [showMenuAlter, setShowMenuAlter] = useState(false); // 메뉴 수정시 사용
  const navigate = useNavigate(); // 로그아웃 시 로그인으로 이동하기위해 사용
  const logOut = () => {
    sessionStorage.removeItem("accessToken"); // 세션 스토리지 accessToken 키 삭제
    navigate("/"); // 로그인 페이지로 이동
  };
  const [eventModal, setEventModal] = useState(false); // 이벤트 조회 모달
  const [showEventCreate, setShowEventCreate] = useState(false); // 이벤트 등록 모달 토글
  const [eventList, setEventList] = useState({}); // 이벤트 조회시 이벤트 값 저장
  const [showEventAlter, setShowEventAlter] = useState(false); // 이벤트 수정 모달
  const [noticeModal, setNoticeModal] = useState(false); // 공지 모달
  const [noticeCreateModal, setNoticeCreateModal] = useState(false); // 공지 등록 모달
  const [noticeList, setNoticeList] = useState({}); // 공지 조회
  const [showWriteAlter, setShowWriteAlter] = useState(false); // 공지 수정 모달
  const [delImageUrl, setDelImageUrl] = useState(""); // 이미지 삭제
  const API = process.env.REACT_APP_API; // env API 주소
  const EVENTSEARCHALL = "&Event=ALL&Title=&EventId="; // 이벤트 전체 조회
  const NOTICESEARCHALL = `&Notice=ALL&Title=&writeId=`; // 공지 전체 조회
  const MENUSEARCHALL = `&Category=분류&Name=`; // 메뉴 전체조회
  const MENUSEARCH = `&Category=${category}&Name=${search}`; // 메뉴 선택 조회
  const EVENTSEARCH = `&Event=ALL&Title=${search}&EventId=`; // 이벤트 선택 조회
  const NOTICESEARCH = `&Notice=ALL&Title=${search}&writeId=`; // 공지 선택 조회

  useEffect(() => {
    // 세션 스토리지에 AuthForm 키의 값이 있으면 상태 변경
    if (sessionStorage.getItem("AuthForm")) {
      setSmsAuth(true);
    }
  }, [setSmsAuth]); // SMS 인증 상태 값이 설정 될 때마다 적용
  const generatorAPI = async () => {
    if (smsAuth) {
      // SMS 인증이 성공하면 유저 정보 조회
      const res = await axios.get(API + "/users");
      const users = res.data;
      users.find((element) => {
        // DB의 userToken과 세션 스토리지 accessToken과 비교해서 맞으면 API 키 값이 포함된 URL 제공
        if (element.userToken === sessionStorage.getItem("accessToken")) {
          setApiKey(API + "/api/?apikey=" + decrypt(element.userApiKey));
        }
      });
    } else {
      setApiKey("휴대폰 번호 인증 필요");
    }
  };

  // setTimeout(() => {
  //   sessionStorage.removeItem("accessToken");
  //   navigate("/");
  // }, 1800000); // 30분이 지나면 세션스토리지 accessToken 키와 값 삭제 후 로그인 페이지 이동

  setTimeout(() => {
    sessionStorage.removeItem("AuthForm");
  }, 1000 * 60 * 60 * 24);
  // 하루 지나면 세션 스토리지에서 AuthForm 키와 값 삭제

  const menuView = async () => {
    // 메뉴 조회 시 카테고리 지정 및 검색 값에 따른 DB 조회
    const menu = await axios.get(apiKey + MENUSEARCH);
    setMenuList(menu.data);
    setModal(!modal);
  };

  const eventView = async () => {
    // 이벤트 조회 시 이벤트 제목 또는 ID로 전체 검색
    const event = await axios.get(apiKey + EVENTSEARCHALL);
    setEventList(event.data);
    setEventModal(!eventModal);
  };

  const noticeView = async () => {
    const notice = await axios.get(apiKey + NOTICESEARCHALL);
    setNoticeList(notice.data);
    setNoticeModal(!noticeModal);
  };
  const SearchForm = async (e) => {
    // 검색 버튼 클릭 시 카테고리 및 검색 값을 설정 후 설정된 값으로 검색
    e.preventDefault();
    setSearch(e.target.Search.value);
    setCategory(e.target.Category.value);
    const menu = await axios.get(apiKey + MENUSEARCH);
    setMenuList(menu.data);
  };

  const EventForm = async (e) => {
    // 이벤트 검색 버튼 클릭 시 카테고리 및 검색 값을 설정 후 설정된 값으로 검색
    e.preventDefault();
    setSearch(e.target.Search.value);
    const event = await axios.get(apiKey + EVENTSEARCH);
    setEventList(event.data);
  };

  const noticeSearchForm = async (e) => {
    e.preventDefault();
    setSearch(e.target.Search.value);
    const notice = await axios.get(apiKey + NOTICESEARCH);
    setNoticeList(notice.data);
  };

  const showMenuCreateModal = () => {
    // 메뉴 등록 모달 토글
    setShowMenuCreate(!showMenuCreate);
  };

  const NoticeCreateModal = () => {
    setNoticeCreateModal(!noticeCreateModal);
  };

  const onClickAlt = async (e) => {
    e.preventDefault();
    // 수정 버튼 클릭시 카테고리 & 이름 값으로 검색
    const category = e.target.parentElement.parentElement.children[1].innerText;
    const search = e.target.parentElement.parentElement.children[2].innerText;
    const productId =
      e.target.parentElement.parentElement.children[3].innerText;
    const res = await axios.get(
      apiKey + `&Category=${category}&Name=${search}&ProductId=${productId}`
    );

    setMenuInfo(res.data); // 수정할 항목을 검색해서 정보 재설정
    setShowMenuAlter(!showMenuAlter); // 모달창 온오프
  };

  const onClickEventAlt = async (e) => {
    e.preventDefault();
    // 수정 버튼 클릭시 이벤트 아이디 값으로 검색

    const EventId = e.target.parentElement.parentElement.children[2].innerText;
    const res = await axios.get(apiKey + EVENTSEARCHALL + `${EventId}`);
    setMenuInfo(res.data); // 수정할 항목을 검색해서 정보 재설정
    setShowEventAlter(!showEventAlter); // 모달창 온오프
  };

  const onClickWriteAlt = async (e) => {
    e.preventDefault();
    // 수정 버튼 클릭시 게시글 아이디 값으로 검색
    const WriteId = e.target.parentElement.parentElement.children[1].innerText;
    const res = await axios.get(apiKey + NOTICESEARCHALL + `${WriteId}`);
    setMenuInfo(res.data); // 수정할 항목을 검색해서 정보 재설정
    setShowWriteAlter(!showWriteAlter); // 모달창 온오프
  };

  const onClickDel = async (e) => {
    // 상품 ID를 조건으로 맞으면 삭제
    e.preventDefault();
    const ProductId =
      e.target.parentElement.parentElement.children[3].innerText;
    try {
      await axios
        .post(API + "/menu/delete", {
          ProductId,
        })
        .then(
          // 삭제가 완료되면 목록 갱신을 위해 전체 조회
          setMenuList(await (await axios.get(apiKey + MENUSEARCH)).data)
        );
    } catch (error) {
      console.error(error);
    }
  };

  const onClickEventDel = async (e) => {
    // 이벤트 ID를 조건으로 맞으면 삭제
    e.preventDefault();
    const EventId = e.target.parentElement.parentElement.children[2].innerText;
    eventList.find((el) => {
      if (el.EventId === EventId) {
        setDelImageUrl(el.Image);
      }
    });
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios
          .post(API + "/event/delete", {
            EventId,
            delImageUrl,
          })
          .then(
            // 삭제가 완료되면 목록 갱신을 위해 전체 조회
            setEventList(await (await axios.get(apiKey + EVENTSEARCHALL)).data)
          );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onClickWriteDel = async (e) => {
    // 게시글 ID를 조건으로 맞으면 삭제
    e.preventDefault();
    const WriteId = e.target.parentElement.parentElement.children[2].innerText;

    try {
      await axios
        .post(API + "/notice/delete", {
          WriteId,
        })
        .then(
          // 삭제가 완료되면 목록 갱신을 위해 전체 조회
          setNoticeList(await (await axios.get(apiKey + NOTICESEARCHALL)).data)
        );
    } catch (error) {
      console.error(error);
    }
  };

  const showEventCreateModal = () => {
    // 이벤트 등록 모달 토글
    setShowEventCreate(!showEventCreate);
  };

  let count = 1;
  let imgCount = 1;
  let noticeCount = 1;
  return (
    <>
      <div className={style.apiKeyForm}>
        <span>
          <div>
            <h3>사이드 메뉴</h3>
          </div>
          <button onClick={generatorAPI}>API 키 발급</button>
          <CopyToClipboard text={apiKey}>
            <button onClick={() => alert("클립보드 복사")}>
              클립보드 복사
            </button>
          </CopyToClipboard>
          <button onClick={logOut}>로그아웃</button>
        </span>
        {smsAuth ? (
          <>
            <div className={style.menubar}>
              <span>
                <h3>관리자 메뉴</h3>
                <button onClick={menuView}>메뉴 관리</button>
                <button onClick={eventView}>이벤트 관리</button>
                <button onClick={noticeView}>공지 사항 관리</button>
              </span>
            </div>
          </>
        ) : null}
        <span>
          {smsAuth ? null : <SMSAuth />}
          {smsAuth ? <p>30분 후 로그 아웃됩니다.</p> : null}
          <div className={style.apiKeySpace}>{apiKey}</div>
        </span>
      </div>
      {/* 모달 사용 */}
      <Modal
        isOpen={modal}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        {/* 인자 값이 배열일 경우 */}
        {Array.isArray(menuList) ? (
          <>
            <div>
              <form onSubmit={SearchForm} className={style.searchForm}>
                <select name="Category">
                  <option>분류</option>
                  <option>콜드 브루</option>
                  <option>브루드 커피</option>
                  <option>에스프레소</option>
                  <option>프라푸치노</option>
                  <option>블렌디드</option>
                  <option>스타벅스 리프레셔</option>
                  <option>스타벅스 피지오</option>
                  <option>티(티바나)</option>
                  <option>에이드</option>
                  <option>브레드</option>
                  <option>케이크</option>
                  <option>샌드위치</option>
                  <option>샐러드</option>
                  <option>따뜻한 푸드</option>
                </select>
                <input placeholder="Search Bar" name="Search" />
                <button>메뉴 검색</button>
                <button onClick={showMenuCreateModal}>메뉴 등록</button>
                <button onClick={() => setModal(!modal)}>닫기</button>
              </form>
            </div>
            <MenuExcelDownload apiKey={apiKey} MENUSEARCHALL={MENUSEARCHALL} />
            <div className={style.ItemList}>
              <span>번호</span>
              <span>제품이미지</span>
              <span>카테고리</span>
              <span>제품이름</span>
              <span>제품번호</span>
              <span>수정/삭제</span>
            </div>
          </>
        ) : null}
        <div className={style.ItemListWrap}>
          {/* 인자가 배열일 경우 map 사용 */}
          {Array.isArray(menuList)
            ? menuList.map((menu, idx) => {
                return (
                  <div key={idx} className={style.ItemList}>
                    {/* 조회된 아이템에 따라 카운트 증가 */}
                    {count++}
                    <img src={menu.Image} width="50" />
                    <span>{menu.Category}</span>
                    <span>{menu.Name}</span>
                    <span>{menu.ProductId}</span>
                    <span>
                      <button onClick={onClickAlt}>수정</button>
                      <button onClick={onClickDel}>삭제</button>
                    </span>
                  </div>
                );
              })
            : null}
        </div>
        {/* 배열은 0부터 시작하기에 -1 해줌 */}
        검색 된 상품 수 :{count - 1}
      </Modal>
      <Modal
        isOpen={showMenuCreate}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        {/* 메뉴 등록 */}
        <MenuCreate apiKey={apiKey} API={API} MENUSEARCHALL={MENUSEARCHALL} />
        <button
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowMenuCreate(!showMenuCreate);
            setMenuList(await (await axios.get(apiKey + MENUSEARCH)).data);
          }}
        >
          닫기
        </button>
      </Modal>
      <Modal
        isOpen={showMenuAlter}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        <MenuAlter menu={menuInfo} API={API} />
        {/* 수정할 메뉴의 정보를 넘겨 받아 출력 */}
        <button
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowMenuAlter(!showMenuAlter);
            setMenuList(await (await axios.get(apiKey + MENUSEARCH)).data);
          }}
        >
          닫기
        </button>
      </Modal>
      <Modal
        isOpen={eventModal}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        {/* 인자 값이 배열일 경우 */}
        {Array.isArray(eventList) ? (
          <>
            <div>
              <form onSubmit={EventForm} className={style.searchForm}>
                <input placeholder="Search Bar" name="Search" />
                <button>이벤트 검색</button>
                <button onClick={showEventCreateModal}>이벤트 등록</button>
                <button onClick={() => setEventModal(!eventModal)}>닫기</button>
              </form>
            </div>
            <EventExcelDownload
              apiKey={apiKey}
              EVENTSEARCHALL={EVENTSEARCHALL}
            />
            <div className={style.ItemList}>
              <span>번호</span>
              <span>이미지</span>
              <span>작성일자</span>
              <span>고유번호</span>
              <span>제목</span>
              <span>기간</span>
              <span>진행 현황</span>
              <span>수정/삭제</span>
            </div>
          </>
        ) : null}
        <div className={style.ItemListWrap}>
          {/* 인자가 배열일 경우 map 사용 */}
          {Array.isArray(eventList)
            ? eventList.map((event, idx) => {
                return (
                  <div key={idx} className={style.ItemList}>
                    {/* 조회된 아이템에 따라 카운트 증가 */}
                    {imgCount++}
                    <div className={style.imageList}>
                      {event.Image ? (
                        <>
                          {Object.keys(event.Image).map((e, idx) => {
                            return <img key={idx} src={API + event.Image[e]} />;
                          })}
                        </>
                      ) : null}
                    </div>
                    <span>{event.Date}</span>
                    <span>{event.EventId}</span>
                    <span>{event.Title}</span>
                    <span>{event.EventTime}</span>
                    <span>{event.Proceed}</span>
                    <span>
                      <button onClick={onClickEventAlt}>수정</button>
                      <button onClick={onClickEventDel}>삭제</button>
                    </span>
                  </div>
                );
              })
            : null}
        </div>
        {/* 배열은 0부터 시작하기에 -1 해줌 */}
        검색 된 이벤트 수 :{imgCount - 1}
      </Modal>
      <Modal
        isOpen={showEventCreate}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        {/* 이벤트 등록 */}
        <EventCreate
          valid={eventList}
          API={API}
          apiKey={apiKey}
          EVENTSEARCHALL={EVENTSEARCHALL}
        />
        <button
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowEventCreate(!showEventCreate);
            setEventList(await (await axios.get(apiKey + EVENTSEARCHALL)).data);
          }}
        >
          닫기
        </button>
      </Modal>
      <Modal
        isOpen={showEventAlter}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        <EventAlter menu={menuInfo} API={API} />
        {/* 수정할 메뉴의 정보를 넘겨 받아 출력 */}
        <button
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowEventAlter(!showEventAlter);
            setEventList(await (await axios.get(apiKey + EVENTSEARCHALL)).data);
          }}
        >
          닫기
        </button>
      </Modal>
      {/* 모달 사용 */}
      <Modal
        isOpen={noticeModal}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        {/* 인자 값이 배열일 경우 */}
        {Array.isArray(noticeList) ? (
          <>
            <div>
              <form onSubmit={noticeSearchForm} className={style.searchForm}>
                <input placeholder="Search Bar" name="Search" />
                <button>공지 검색</button>
                <button onClick={NoticeCreateModal}>공지 등록</button>
                <button onClick={() => setNoticeModal(!noticeModal)}>
                  닫기
                </button>
              </form>
            </div>
            <NoticeExcelDownload
              apiKey={apiKey}
              NOTICESEARCHALL={NOTICESEARCHALL}
            />
            <div className={style.ItemList}>
              <span>번호</span>
              <span>글번호</span>
              <span>게시글 ID</span>
              <span>제목</span>
              <span>내용</span>
              <span>날짜</span>
              <span>수정/삭제</span>
            </div>
          </>
        ) : null}
        <div className={style.ItemListWrap}>
          {/* 인자가 배열일 경우 map 사용 */}
          {Array.isArray(noticeList)
            ? noticeList.map((notice, idx) => {
                return (
                  <div key={idx} className={style.ItemList}>
                    {/* 조회된 아이템에 따라 카운트 증가 */}
                    <span>{noticeCount++}</span>
                    <span>{notice.Num}</span>
                    <span>{notice.Id}</span>
                    <span>{notice.Title}</span>
                    <span>{notice.Desc}</span>
                    <span>{notice.Date}</span>
                    <span>
                      <button onClick={onClickWriteAlt}>수정</button>
                      <button onClick={onClickWriteDel}>삭제</button>
                    </span>
                  </div>
                );
              })
            : null}
        </div>
        {/* 배열은 0부터 시작하기에 -1 해줌 */}
        검색 된 공지 수 :{noticeCount - 1}
      </Modal>
      <Modal
        isOpen={noticeCreateModal}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        {/* 사이트 공지사항 등록 */}
        <NoticeCreate valid={noticeList} API={API} />
        <button
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            const notice = await axios.get(apiKey + NOTICESEARCHALL);
            setNoticeList(notice.data);
            setNoticeCreateModal(!noticeCreateModal);
          }}
        >
          닫기
        </button>
      </Modal>
      <Modal
        isOpen={showWriteAlter}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        <NoticeAlter menu={menuInfo} API={API} />
        {/* 수정할 메뉴의 정보를 넘겨 받아 출력 */}
        <button
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowWriteAlter(!showWriteAlter);
            setNoticeList(
              await (
                await axios.get(apiKey + NOTICESEARCHALL)
              ).data
            );
          }}
        >
          닫기
        </button>
      </Modal>
    </>
  );
};

export default Home;

import axios from "axios";
import { useEffect, useState } from "react"; // 상태값 설정
import CopyToClipboard from "react-copy-to-clipboard"; // 클립보드에 복사
import { useNavigate } from "react-router-dom"; // 로그아웃 시 로그인 페이지로 이동
import { decrypt } from "../Crypto/chiper"; // 복호화
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
import ButtonGroup from "@mui/material/ButtonGroup"; // 버튼 그룹핑
import Button from "@mui/material/Button";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import style from "../CSS/Home/Home.module.css";

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
    sessionStorage.removeItem("AuthForm");
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
  const STORAGEAUTH = sessionStorage.getItem("AuthForm");
  const STORAGEACT = sessionStorage.getItem("accessToken");

  useEffect(() => {
    // 세션 스토리지에 AuthForm 키의 값이 있으면 상태 변경
    if (STORAGEAUTH) {
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
        if (element.userToken === STORAGEACT) {
          setApiKey(API + "/api/?apikey=" + decrypt(element.userApiKey));
        }
      });
    } else {
      setApiKey("휴대폰 번호 인증 필요");
    }
  };

  setTimeout(() => {
    sessionStorage.removeItem("accessToken");
    navigate("/");
  }, 1000 * 60 * 60 * 24); // 하루 지나면 세션스토리지 accessToken 키와 값 삭제 후 로그인 페이지 이동

  setTimeout(() => {
    sessionStorage.removeItem("AuthForm");
  }, 1000 * 60 * 60 * 24);
  // 하루 지나면 세션 스토리지에서 AuthForm 키와 값 삭제

  const menuView = async () => {
    // 메뉴 조회 시 카테고리 지정 및 검색 값에 따른 DB 조회
    const menu = await axios.get(apiKey + MENUSEARCH);
    setMenuList(menu.data);
    setModal(!modal);
    setEventModal(false);
    setNoticeModal(false);
  };

  const eventView = async () => {
    // 이벤트 조회 시 이벤트 제목 또는 ID로 전체 검색
    const event = await axios.get(apiKey + EVENTSEARCHALL);
    setEventList(event.data);
    setModal(false);
    setEventModal(!eventModal);
    setNoticeModal(false);
  };

  const noticeView = async () => {
    const notice = await axios.get(apiKey + NOTICESEARCHALL);
    setNoticeList(notice.data);
    setModal(false);
    setEventModal(false);
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

  const handleCategory = (e) => {
    setCategory(e.target.value);
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
    const category = e.target.parentElement.parentElement.children[2].innerText;
    const search = e.target.parentElement.parentElement.children[3].innerText;
    const productId =
      e.target.parentElement.parentElement.children[4].innerText;
    const res = await axios.get(
      apiKey + `&Category=${category}&Name=${search}&ProductId=${productId}`
    );

    setMenuInfo(res.data); // 수정할 항목을 검색해서 정보 재설정
    setShowMenuAlter(!showMenuAlter); // 모달창 온오프
  };

  const onClickEventAlt = async (e) => {
    e.preventDefault();
    // 수정 버튼 클릭시 이벤트 아이디 값으로 검색
    const EventId = e.target.parentElement.parentElement.children[3].innerText;
    const res = await axios.get(apiKey + EVENTSEARCHALL + `${EventId}`);
    setMenuInfo(res.data); // 수정할 항목을 검색해서 정보 재설정
    setShowEventAlter(!showEventAlter); // 모달창 온오프
  };

  const onClickWriteAlt = async (e) => {
    e.preventDefault();
    // 수정 버튼 클릭시 게시글 아이디 값으로 검색
    const WriteId = e.target.parentElement.parentElement.children[2].innerText;
    const res = await axios.get(apiKey + NOTICESEARCHALL + `${WriteId}`);
    setMenuInfo(res.data); // 수정할 항목을 검색해서 정보 재설정
    setShowWriteAlter(!showWriteAlter); // 모달창 온오프
  };

  const onClickDel = async (e) => {
    // 상품 ID를 조건으로 맞으면 삭제
    e.preventDefault();
    const ProductId =
      e.target.parentElement.parentElement.children[4].innerText;
    if (window.confirm("정말 삭제하시겠습니까?")) {
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
    }
  };

  const onClickEventDel = async (e) => {
    // 이벤트 ID를 조건으로 맞으면 삭제
    e.preventDefault();
    const EventId = e.target.parentElement.parentElement.children[3].innerText;
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
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios
          .post(API + "/notice/delete", {
            WriteId,
          })
          .then(
            // 삭제가 완료되면 목록 갱신을 위해 전체 조회
            setNoticeList(
              await (
                await axios.get(apiKey + NOTICESEARCHALL)
              ).data
            )
          );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const showEventCreateModal = () => {
    // 이벤트 등록 모달 토글
    setShowEventCreate(!showEventCreate);
  };

  const leaveUser = async () => {
    if (window.confirm("탈퇴 하시겠습니까?")) {
      const res = await axios.get(API + "/users");
      const users = res.data;

      users.find((element) => {
        if (element.userToken === STORAGEACT) {
          const userToken = STORAGEACT;
          try {
            axios
              .post(API + "/users/delete", {
                userToken,
              })
              .then(alert("탈퇴되었습니다."));
          } catch (error) {
            console.error(error);
          }
          logOut();
          navigate("/");
        }
      });
    } else {
      alert("취소되었습니다.");
    }
  };

  let count = 1;
  let imgCount = 1;
  let noticeCount = 1;

  const STACK = {
    padding: 0.5,
    bgcolor: "#6ab2fc",
    height: 200,
    width: 130,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
  };
  const SIDEBUTTON = {
    color: "white",
    bgcolor: "inherit",
    border: 0,
  };
  const MMBTN = {
    m: 1,
    color: "white",
    borderColor: "white",
  };
  const MMB = {
    textAlign: "center",
    height: 208,
    minWidth: "100%",
    bgcolor: "#93DAFF",
  };
  const SELECT = {
    height: 38,
  };
  const FONTCONTROL = { m: 1, minWidth: 100, height: 40 };
  const TBTN = { m: 1.2, color: "gray", borderColor: "gray" };
  const TCELL = { color: "white" };
  const TXTFID = { flexGrow: 1.5 };
  const TABLEFORM = {
    minWidth: 800,
    textAlign: "center",
  };
  const TABLEINDEX = {
    minWidth: 800,
    textAlign: "center",
    bgcolor: "#1877d5",
  };
  const TABLEROW = {
    "&:last-child td, &:last-child th": { border: 0 },
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
  };
  const TCBTN = { m: 0.5 };

  const EXITBTN = {
    m: 0.2,
    color: "#1877d5",
    borderColor: "#1877d5",
  };

  const IMG = {
    width: 150,
    height: 150,
    overflow: "auto",
    textAlign: "center",
  };

  return (
    <>
      <div className={style.WRAP}>
        <Box>
          <Stack sx={STACK} spacing={1}>
            <ButtonGroup orientation="vertical">
              <Button sx={SIDEBUTTON} onClick={generatorAPI}>
                API 키 발급
              </Button>
            </ButtonGroup>
            <ButtonGroup orientation="vertical">
              <CopyToClipboard text={apiKey}>
                <Button sx={SIDEBUTTON} onClick={() => alert("클립보드 복사")}>
                  클립보드 복사
                </Button>
              </CopyToClipboard>
            </ButtonGroup>
            <ButtonGroup orientation="vertical">
              <Button sx={SIDEBUTTON} onClick={logOut}>
                로그아웃
              </Button>
            </ButtonGroup>
            {smsAuth ? (
              <ButtonGroup orientation="vertical">
                <Button sx={SIDEBUTTON} onClick={leaveUser}>
                  회원 탈퇴
                </Button>
              </ButtonGroup>
            ) : null}
          </Stack>
        </Box>
        <Box className={style.mainMenuWrap}>
          <Box sx={MMB}>
            {smsAuth ? (
              <Box sx={{ mt: 6 }}>
                <div>
                  <Button sx={MMBTN} variant="outlined" onClick={menuView}>
                    제품 관리
                  </Button>
                  <Button sx={MMBTN} variant="outlined" onClick={eventView}>
                    이벤트 관리
                  </Button>
                  <Button sx={MMBTN} variant="outlined" onClick={noticeView}>
                    공지 사항 관리
                  </Button>
                </div>
              </Box>
            ) : null}
            {smsAuth ? null : <SMSAuth />}
            <Typography variant="h8">{apiKey}</Typography>
          </Box>
        </Box>
      </div>
      {/* 인자 값이 배열일 경우 */}
      {modal || eventModal || noticeModal ? null : (
        <div className={style.EMPTYIMAGE} />
      )}
      {modal ? (
        <>
          {Array.isArray(menuList) ? (
            <>
              <form onSubmit={SearchForm} className={style.SearchForm}>
                <FormControl sx={FONTCONTROL}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="Category"
                    value={category}
                    onChange={handleCategory}
                    autoWidth
                    sx={SELECT}
                  >
                    <MenuItem value="분류">분류</MenuItem>
                    <MenuItem value="콜드 브루">콜드 브루</MenuItem>
                    <MenuItem value="브루드 커피">브루드 커피</MenuItem>
                    <MenuItem value="에스프레소">에스프레소</MenuItem>
                    <MenuItem value="프라푸치노">프라푸치노</MenuItem>
                    <MenuItem value="블렌디드">블렌디드</MenuItem>
                    <MenuItem value="스타벅스 리프레셔">
                      스타벅스 리프레셔
                    </MenuItem>
                    <MenuItem value="스타벅스 피지오">스타벅스 피지오</MenuItem>
                    <MenuItem value="티(티바나)">티(티바나)</MenuItem>
                    <MenuItem value="에이드">에이드</MenuItem>
                    <MenuItem value="브레드">브레드</MenuItem>
                    <MenuItem value="케이크">케이크</MenuItem>
                    <MenuItem value="샌드위치">샌드위치</MenuItem>
                    <MenuItem value="따뜻한 푸드">따뜻한 푸드</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  placeholder="Search Bar"
                  name="Search"
                  variant="standard"
                  sx={TXTFID}
                />
                <Button type="submit" sx={TBTN} variant="outlined">
                  제품 검색
                </Button>
                {STORAGEAUTH === "INTERVIEW" ? null : (
                  <Button
                    sx={TBTN}
                    variant="outlined"
                    onClick={showMenuCreateModal}
                  >
                    제품 등록
                  </Button>
                )}
                <MenuExcelDownload
                  apiKey={apiKey}
                  MENUSEARCHALL={MENUSEARCHALL}
                />
                <Button
                  sx={TBTN}
                  variant="outlined"
                  onClick={() => setModal(!modal)}
                >
                  닫기
                </Button>
              </form>
              <Table sx={TABLEINDEX}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={TCELL}>
                      번호
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      제품이미지
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      카테고리
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      제품이름
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      제품번호
                    </TableCell>
                    {STORAGEAUTH === "INTERVIEW" ? null : (
                      <TableCell align="center" sx={TCELL}>
                        수정/삭제
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
              </Table>
            </>
          ) : null}
          <div style={{ height: "57.1vh", overflow: "auto" }}>
            {/* 인자가 배열일 경우 map 사용 */}
            {Array.isArray(menuList)
              ? menuList.map((menu, idx) => {
                  return (
                    <Table sx={TABLEFORM} key={idx}>
                      <TableHead>
                        <TableRow sx={TABLEROW}>
                          <TableCell>{count++}</TableCell>
                          <TableCell>
                            <img src={menu.Image} width="150" />
                          </TableCell>
                          <TableCell>{menu.Category}</TableCell>
                          <TableCell>{menu.Name}</TableCell>
                          <TableCell>{menu.ProductId}</TableCell>
                          {STORAGEAUTH === "INTERVIEW" ? null : (
                            <TableCell>
                              <Button
                                sx={TCBTN}
                                variant="outlined"
                                onClick={onClickAlt}
                              >
                                수정
                              </Button>
                              <Button
                                sx={TCBTN}
                                variant="outlined"
                                onClick={onClickDel}
                              >
                                삭제
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                    </Table>
                  );
                })
              : null}
          </div>
          {/* 배열은 0부터 시작하기에 -1 해줌 */}
          검색 된 상품 수 :{count - 1}
        </>
      ) : null}
      <Modal
        isOpen={showMenuCreate}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        {/* 메뉴 등록 */}
        <MenuCreate apiKey={apiKey} API={API} MENUSEARCHALL={MENUSEARCHALL} />
        <Button
          size="small"
          sx={EXITBTN}
          variant="outlined"
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowMenuCreate(!showMenuCreate);
            setMenuList(await (await axios.get(apiKey + MENUSEARCH)).data);
          }}
        >
          닫기
        </Button>
      </Modal>
      <Modal
        isOpen={showMenuAlter}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        <MenuAlter menu={menuInfo} API={API} />
        {/* 수정할 메뉴의 정보를 넘겨 받아 출력 */}
        <Button
          size="small"
          sx={EXITBTN}
          variant="outlined"
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowMenuAlter(!showMenuAlter);
            setMenuList(await (await axios.get(apiKey + MENUSEARCH)).data);
          }}
        >
          닫기
        </Button>
      </Modal>
      {eventModal ? (
        <>
          {/* 인자 값이 배열일 경우 */}
          {Array.isArray(eventList) ? (
            <>
              <form onSubmit={EventForm} className={style.SearchForm}>
                <TextField
                  placeholder="Search Bar"
                  name="Search"
                  variant="standard"
                  sx={TXTFID}
                />
                <Button type="submit" sx={TBTN} variant="outlined">
                  이벤트 검색
                </Button>
                {STORAGEAUTH === "INTERVIEW" ? null : (
                  <Button
                    sx={TBTN}
                    variant="outlined"
                    onClick={showEventCreateModal}
                  >
                    이벤트 등록
                  </Button>
                )}
                <EventExcelDownload
                  apiKey={apiKey}
                  EVENTSEARCHALL={EVENTSEARCHALL}
                />
                <Button
                  sx={TBTN}
                  variant="outlined"
                  onClick={() => setEventModal(!eventModal)}
                >
                  닫기
                </Button>
              </form>
              <Table sx={TABLEINDEX}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={TCELL}>
                      번호
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      이미지
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      작성일자
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      고유번호
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      제목
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      기간
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      진행 현황
                    </TableCell>
                    {STORAGEAUTH === "INTERVIEW" ? null : (
                      <TableCell align="center" sx={TCELL}>
                        수정/삭제
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
              </Table>
            </>
          ) : null}
          <div style={{ height: "57.1vh", overflow: "auto" }}>
            {/* 인자가 배열일 경우 map 사용 */}
            {Array.isArray(eventList)
              ? eventList.map((event, idx) => {
                  {
                    imgCount++;
                  }
                  return (
                    <Table sx={TABLEFORM} key={idx}>
                      <TableHead>
                        <TableRow sx={TABLEROW}>
                          <TableCell align="center">{count++}</TableCell>
                          <TableCell align="center">
                            {event.Image ? (
                              <Box sx={IMG}>
                                {/* 조회된 아이템에 따라 카운트 증가 */}
                                {Object.keys(event.Image).map((e, idx) => {
                                  return (
                                    <img
                                      key={idx}
                                      src={API + event.Image[e]}
                                      width="100"
                                    />
                                  );
                                })}
                              </Box>
                            ) : (
                              <Box sx={IMG}>
                                <img key={idx} src="#" width="150" />
                              </Box>
                            )}
                          </TableCell>
                          <TableCell align="center">{event.Date}</TableCell>
                          <TableCell align="center">{event.EventId}</TableCell>
                          <TableCell align="center">{event.Title}</TableCell>
                          <TableCell align="center">
                            {event.EventTime}
                          </TableCell>
                          <TableCell align="center">{event.Proceed}</TableCell>
                          {STORAGEAUTH === "INTERVIEW" ? null : (
                            <TableCell align="center">
                              <Button
                                sx={TCBTN}
                                variant="outlined"
                                onClick={onClickEventAlt}
                              >
                                수정
                              </Button>
                              <Button
                                sx={TCBTN}
                                variant="outlined"
                                onClick={onClickEventDel}
                              >
                                삭제
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                    </Table>
                  );
                })
              : null}
          </div>
          {/* 배열은 0부터 시작하기에 -1 해줌 */}
          검색 된 이벤트 수 :{imgCount - 1}
        </>
      ) : null}
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
        <Button
          size="small"
          sx={EXITBTN}
          variant="outlined"
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowEventCreate(!showEventCreate);
            setEventList(await (await axios.get(apiKey + EVENTSEARCHALL)).data);
          }}
        >
          닫기
        </Button>
      </Modal>
      <Modal
        isOpen={showEventAlter}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        <EventAlter menu={menuInfo} API={API} />
        {/* 수정할 메뉴의 정보를 넘겨 받아 출력 */}
        <Button
          size="small"
          sx={EXITBTN}
          variant="outlined"
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            setShowEventAlter(!showEventAlter);
            setEventList(await (await axios.get(apiKey + EVENTSEARCHALL)).data);
          }}
        >
          닫기
        </Button>
      </Modal>
      {/* 모달 사용 */}
      {noticeModal ? (
        <>
          {Array.isArray(noticeList) ? (
            <>
              <form onSubmit={noticeSearchForm} className={style.SearchForm}>
                <TextField
                  placeholder="Search Bar"
                  name="Search"
                  variant="standard"
                  sx={TXTFID}
                />
                <Button type="submit" sx={TBTN} variant="outlined">
                  공지 검색
                </Button>
                {STORAGEAUTH === "INTERVIEW" ? null : (
                  <Button
                    sx={TBTN}
                    variant="outlined"
                    onClick={NoticeCreateModal}
                  >
                    공지 등록
                  </Button>
                )}

                <NoticeExcelDownload
                  apiKey={apiKey}
                  NOTICESEARCHALL={NOTICESEARCHALL}
                />
                <Button
                  sx={TBTN}
                  variant="outlined"
                  onClick={() => setNoticeModal(!noticeModal)}
                >
                  닫기
                </Button>
              </form>
              <Table sx={TABLEINDEX}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={TCELL}>
                      번호
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      글번호
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      게시글 ID
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      제목
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      내용
                    </TableCell>
                    <TableCell align="center" sx={TCELL}>
                      날짜
                    </TableCell>
                    {STORAGEAUTH === "INTERVIEW" ? null : (
                      <TableCell align="center" sx={TCELL}>
                        수정/삭제
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
              </Table>
            </>
          ) : null}
          <div style={{ height: "57.1vh", overflow: "auto" }}>
            {/* 인자가 배열일 경우 map 사용 */}
            {Array.isArray(noticeList)
              ? noticeList.map((notice, idx) => {
                  {
                    noticeCount++;
                  }
                  return (
                    <Table sx={TABLEFORM} key={idx}>
                      <TableHead>
                        <TableRow sx={TABLEROW}>
                          <TableCell align="center">{count++}</TableCell>
                          <TableCell align="center">{notice.Num}</TableCell>
                          <TableCell align="center">{notice.Id}</TableCell>
                          <TableCell align="center">{notice.Title}</TableCell>
                          <TableCell align="center">{notice.Desc}</TableCell>
                          <TableCell align="center">{notice.Date}</TableCell>
                          {STORAGEAUTH === "INTERVIEW" ? null : (
                            <TableCell align="center">
                              <Button
                                sx={TCBTN}
                                variant="outlined"
                                onClick={onClickWriteAlt}
                              >
                                수정
                              </Button>
                              <Button
                                sx={TCBTN}
                                variant="outlined"
                                onClick={onClickWriteDel}
                              >
                                삭제
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                    </Table>
                  );
                })
              : null}
          </div>
          {/* 배열은 0부터 시작하기에 -1 해줌 */}
          검색 된 공지 수 : {noticeCount - 1}
        </>
      ) : null}
      <Modal
        isOpen={noticeCreateModal}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        {/* 사이트 공지사항 등록 */}
        <NoticeCreate valid={noticeList} API={API} />
        <Button
          size="small"
          sx={EXITBTN}
          variant="outlined"
          onClick={async () => {
            // 닫을 때 목록 갱신을 위해 전체 조회
            const notice = await axios.get(apiKey + NOTICESEARCHALL);
            setNoticeList(notice.data);
            setNoticeCreateModal(!noticeCreateModal);
          }}
        >
          닫기
        </Button>
      </Modal>
      <Modal
        isOpen={showWriteAlter}
        appElement={document.getElementById("root") || undefined}
        className={style.Modal}
      >
        <NoticeAlter menu={menuInfo} API={API} />
        {/* 수정할 메뉴의 정보를 넘겨 받아 출력 */}
        <Button
          size="small"
          sx={EXITBTN}
          variant="outlined"
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
        </Button>
      </Modal>
    </>
  );
};

export default Home;

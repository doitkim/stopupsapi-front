# Stopups api Front 작업 현황

## 로그인, 회원가입

- 비밀번호 정규 표현식 사용 (영문,대소문자,숫자,특수문자 포함 8-16자)

## 회원가입

- 가입 시 계정 존재 여부 확인

## 홈

- API KEY 발급 (계정별 시그니처 삽입하여 API 요청 주소로 사용)
- 세션 타임아웃 (30분 설정 이후 세션 종료, 휴대폰 인증은 하루로 설정)
- 클립보드 복사 (클릭시 API 요청 주소 복사 가능)

### 관리자 메뉴 (휴대전화 인증 시 사용 가능하며 API KEY와 혼용)

- 메뉴 관리
- 사이트 이미지 관리
- 공지 사항

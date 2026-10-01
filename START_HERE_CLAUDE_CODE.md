# 우리 반 식물 관찰일지 — Claude Code 인수인계

이 폴더는 현재 배포 중인 학급용 식물 관찰일지 웹앱의 소스 코드입니다.

## 현재 사이트

- 주소: https://class-plant-journal.seungyeonoh.chatgpt.site/
- Sites 프로젝트 ID: `appgprj_6abc7ef45ee08191a8464d00c0081134`
- 이 압축본의 기준 커밋: `2fec03ad72d886cce24422165dad5e81484be974`
- 기준 배포 버전: 5

## 먼저 알아둘 구조

실제 배포되는 Cloudflare Worker 소스는 `worker-src/`에 있습니다.

- `worker-src/index.js`: API, 로그인, 권한, D1/R2 처리, CSV 명단 가져오기
- `worker-src/html.js`: 전체 HTML 구조
- `worker-src/client.js`: 화면 상태와 사용자 동작
- `worker-src/styles.js`: 사이트 디자인과 반응형 스타일
- `db/schema.ts`: 데이터베이스 스키마
- `drizzle/`: 배포 시 적용되는 D1 마이그레이션
- `.openai/hosting.json`: Sites 프로젝트와 D1/R2 바인딩

`app/`, `components/` 등은 초기 프로젝트 구조입니다. 현재 서비스 화면을 수정할 때는 우선 `worker-src/`를 수정하세요.

## 설치 및 점검

Node.js와 pnpm이 설치되어 있다는 가정입니다.

```powershell
pnpm install
node --check worker-src/index.js
node --check worker-src/html.js
node --check worker-src/client.js
node --check worker-src/styles.js
node --input-type=module -e "import('./worker-src/client.js').then(m=>{new Function(m.APP_JS);console.log('client embedded script OK')})"
./node_modules/.bin/tsc.cmd --noEmit
```

배포 파일을 만들기 전에는 `worker-src/*.js` 네 파일을 `dist/server/`로 복사해야 합니다. `dist/`는 생성 결과이므로 이 압축본에는 포함하지 않았습니다.

## 현재 구현된 주요 기능

- 학생·교사 네 자리 PIN 로그인
- 학생 초기 비밀번호 `0000` 및 첫 로그인 시 비밀번호 변경
- 학생은 다른 친구의 기록을 읽을 수 있지만 자기 기록 또는 소속 모둠 기록만 수정
- 교사의 학생 추가, CSV 명단 일괄 추가, PIN 초기화
- 개인·모둠 식물 등록과 모둠원 공동 편집
- 키우기 전·중·후 단계별 기록
- 사진은 R2, 기록과 계정 정보는 D1에 저장
- UTF-8, CP949(ANSI), UTF-16 CSV와 쉼표·세미콜론·탭 구분 지원
- 로그인 및 명단 추가 직후 서버 데이터를 다시 불러와 새로고침 없이 표시

## 데이터와 보안 주의사항

- 실제 학생 데이터는 압축본에 들어 있지 않습니다.
- 인증 토큰, 저장소 쓰기 자격 증명, 세션 쿠키는 포함하지 않았습니다.
- `.openai/hosting.json`의 D1 바인딩은 `DB`, R2 바인딩은 `BUCKET`입니다.
- 공개 사이트이므로 모든 쓰기 API에서 서버 측 로그인과 권한 검사를 유지해야 합니다.
- 기존 마이그레이션 파일은 수정하지 말고, 스키마 변경 시 새 마이그레이션을 추가하세요.
- 사진 최대 크기는 8MB입니다.

## Claude Code에 처음 요청할 문장 예시

> 이 폴더의 `START_HERE_CLAUDE_CODE.md`와 `worker-src/`를 먼저 읽어 줘. 기존 로그인·권한·D1·R2 기능을 유지하면서 내가 요청하는 부분만 수정해 줘. 수정 후 JavaScript 문법 검사와 TypeScript 검사를 실행하고, 배포 전에는 변경된 `worker-src/*.js`를 `dist/server/`에 복사해 줘. 기존 데이터베이스 마이그레이션은 수정하지 마.

사이트 배포에는 OpenAI Sites 연결 권한과 짧은 수명의 저장소 쓰기 자격 증명이 필요합니다. Claude Code 환경에서 해당 연결을 사용할 수 없다면 코드 수정까지만 진행한 뒤, 수정한 폴더를 다시 Codex로 가져와 배포하세요.

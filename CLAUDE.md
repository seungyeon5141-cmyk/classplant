# Claude Code 작업 지침

작업을 시작하기 전에 `START_HERE_CLAUDE_CODE.md`를 모두 읽고, 현재 서비스 구조와 보안 주의사항을 따르세요.

- 실제 서비스 코드는 `worker-src/`가 기준입니다.
- 기존 로그인, 학생별 권한, 모둠 공동 편집, D1 데이터, R2 사진 저장 기능을 보존하세요.
- 기존 `drizzle/*.sql` 파일은 수정하지 말고 스키마 변경이 필요하면 새 마이그레이션을 추가하세요.
- 소스에 비밀번호, 인증 토큰, 쿠키 또는 저장소 자격 증명을 저장하지 마세요.
- 수정 후 JavaScript 문법 검사와 TypeScript 검사를 실행하세요.
- 배포 준비 시 `worker-src/index.js`, `html.js`, `client.js`, `styles.js`를 `dist/server/`로 복사하세요.

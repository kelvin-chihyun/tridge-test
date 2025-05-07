# TRIDGE HOME-TEST(사전과제) FE

## 프로젝트 개요

이 프로젝트는 포켓몬 API를 활용하여 포켓몬 데이터를 탐색할 수 있는 웹 애플리케이션으로, 특히 Breadcrumb(경로 탐색) 컴포넌트의 구현에 중점을 두었습니다. 사용자가 웹사이트 내에서 현재 위치를 쉽게 파악하고 이전 경로로 이동할 수 있도록 직관적인 네비게이션을 제공합니다.

## 기술 스택

- React + TypeScript + Vite
- React Router DOM (라우팅)
- TanStack Query (데이터 페칭)
- TailwindCSS (스타일링)

## 프로젝트 구조

```
src/
├── components/      # 재사용 가능한 컴포넌트
├── pages/           # 페이지 컴포넌트
├── shared/          # 공유 리소스
│   ├── hooks/       # 커스텀 훅
│   └── ui/          # UI 컴포넌트
└── App.tsx          # 애플리케이션 진입점
```

## Breadcrumb 구현 특징

### 1. 컴포넌트 분리 및 재사용성

- **Breadcrumb 컴포넌트**: UI 표현을 담당하는 순수 컴포넌트로 구현
- **useBreadcrumb 훅**: 경로 데이터 로직을 분리하여 관심사 분리 원칙 준수
- **Layout 컴포넌트**: 모든 페이지에 일관된 레이아웃과 Breadcrumb 표시

### 2. 동적 경로 처리

- URL 파라미터(`species`, `pokemon`)에 따라 동적으로 경로명 생성
- API를 통해 실제 포켓몬/종 이름을 가져와 표시
- 경로 변수에 대한 데이터 검증 및 예외 처리

### 3. 사용자 경험 최적화

- **로딩 상태 처리**: 데이터 로딩 중에는 스켈레톤 UI 표시
- **모바일 최적화**: 화면 크기가 작을 때 중간 경로를 생략하여 가독성 향상
- **현재 경로 강조**: 현재 위치는 클릭 불가능한 텍스트로 표시하여 명확히 구분

### 4. TypeScript 활용

- 인터페이스를 통한 타입 안전성 확보
- 컴포넌트 props와 훅 반환값에 명확한 타입 정의
- 컴파일 타임에 오류 감지로 런타임 오류 방지

## 주요 기능

1. **경로 계층 표시**: 현재 페이지까지의 경로를 계층적으로 표시
2. **이전 경로 이동**: 각 경로 항목 클릭 시 해당 페이지로 이동
3. **동적 데이터 표시**: URL 파라미터에 해당하는 실제 데이터 이름 표시
4. **콜백 기능**: 경로 클릭 시 이벤트 처리 가능

## 구현 과정에서 중점을 둔 부분

- **관심사 분리**: UI와 데이터 로직의 명확한 분리
- **재사용성**: 다양한 페이지에서 일관되게 사용 가능한 컴포넌트 설계
- **성능 최적화**: 불필요한 리렌더링 방지 및 데이터 캐싱
- **접근성**: 스크린 리더 지원 및 키보드 네비게이션 고려
- **확장성**: 추가 기능이나 경로 변경에 유연하게 대응할 수 있는 구조

## 실행 방법

```bash
# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

## 라우트 구조

- `/` - Home
- `/species` - Home > Pokemon Species List
- `/species/:species` - Home > Pokemon Species List > {{pokemonSpeciesName}} Overview
- `/species/:species/pokemons` - Home > Pokemon Species List > {{pokemonSpeciesName}} Overview > Pokemon List
- `/species/:species/pokemons/:pokemon` - Home > Pokemon Species List > {{pokemonSpeciesName}} Overview > Pokemon List > {{pokemonName}}

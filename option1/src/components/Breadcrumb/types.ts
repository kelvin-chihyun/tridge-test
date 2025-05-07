// 브레드크럼 아이템의 타입 정의
export interface BreadcrumbItem {
  label: string;      // 표시될 텍스트
  path: string;       // 이동할 경로
  isActive: boolean;  // 현재 활성화된 경로인지 여부
}

// 브레드크럼 컴포넌트의 속성 정의
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;  // 선택적 클릭 콜백 함수
  isMobile?: boolean;  // 모바일 최적화를 위한 플래그
  isLoading?: boolean; // 데이터 로딩 상태
}

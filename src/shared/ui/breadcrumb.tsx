import { Link } from "react-router-dom";
import { Fragment } from "react";

/**
 * 브레드크럼 컴포넌트
 *
 * 웹사이트 내 현재 위치를 보여주는 네비게이션 컴포넌트
 */

// 브레드크럼 아이템의 타입 정의
export interface BreadcrumbItem {
  label: string; // 표시될 텍스트
  path: string; // 이동할 경로
  isActive: boolean; // 현재 활성화된 경로인지 여부
}

// 브레드크럼 컴포넌트의 속성 정의
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void; // 선택적 클릭 콜백 함수
  isMobile?: boolean; // 모바일 최적화를 위한 플래그
  isLoading?: boolean; // 데이터 로딩 상태
}

export const Breadcrumb = ({ items, onItemClick, isMobile = false, isLoading = false }: BreadcrumbProps) => {
  // 아이템이 없거나 로딩 중인 경우 처리
  if (items.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <nav aria-label="breadcrumb" className="py-2 px-4">
        <ol className="flex items-center space-x-2">
          <li className="animate-pulse bg-gray-200 h-4 w-20 rounded"></li>
          <li className="text-gray-500">/</li>
          <li className="animate-pulse bg-gray-200 h-4 w-24 rounded"></li>
        </ol>
      </nav>
    );
  }

  // 모바일 최적화: 중간 경로 생략
  const optimizedItems = isMobile && items.length > 3 ? [items[0], { ...items[1], label: "...", path: "" }, ...items.slice(-2)] : items;

  const handleClick = (item: BreadcrumbItem) => {
    if (onItemClick && !item.isActive) {
      onItemClick(item);
    }
  };

  return (
    <nav aria-label="breadcrumb" className="py-2 px-4 bg-gray-100 rounded">
      <ol className="flex items-center flex-wrap">
        {optimizedItems.map((item, index) => {
          const isLast = index === optimizedItems.length - 1;

          return (
            <Fragment key={item.path || index}>
              <li className={`${isLast ? "font-semibold" : ""}`}>
                {item.isActive ? (
                  <span className="text-gray-700">{item.label}</span>
                ) : item.path ? (
                  <Link to={item.path} className="text-blue-600 hover:underline" onClick={() => handleClick(item)}>
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-500">{item.label}</span>
                )}
              </li>
              {!isLast && (
                <li className="mx-2 text-gray-500">
                  <span>/</span>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

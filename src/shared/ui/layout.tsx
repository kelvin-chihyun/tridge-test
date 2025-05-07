import { useBreadcrumb, useMediaQuery } from "../hooks";
import { Breadcrumb, BreadcrumbItem } from "./";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 레이아웃 컴포넌트
 *
 * 모든 페이지에 공통적으로 적용되는 레이아웃 구조를 제공
 */
export const Layout = ({ children }: LayoutProps) => {
  const { breadcrumbItems, isLoading } = useBreadcrumb();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    // 브레드크럼 아이템 클릭 이벤트 처리 (선택 사항)
    console.log("Breadcrumb item clicked:", item.label);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} onItemClick={handleBreadcrumbClick} isMobile={isMobile} isLoading={isLoading} />
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

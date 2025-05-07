import { useBreadcrumb, useMediaQuery } from "../hooks";
import { Breadcrumb, BreadcrumbItem } from "./";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-white font-bold text-xl hover:text-blue-100 transition-colors duration-200">
              PokéExplorer
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="text-blue-100 hover:text-white transition-colors duration-200">홈</Link>
                </li>
                <li>
                  <Link to="/species" className="text-blue-100 hover:text-white transition-colors duration-200">포켓몬 도감</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="mt-3">
            <Breadcrumb items={breadcrumbItems} onItemClick={handleBreadcrumbClick} isMobile={isMobile} isLoading={isLoading} />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-300">© 2025 PokéExplorer. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                이용약관
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

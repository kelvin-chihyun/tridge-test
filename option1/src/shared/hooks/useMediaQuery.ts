import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리 훅
 * 
 * 반응형 디자인을 위한 미디어 쿼리 상태를 관리하는 훅
 * @param query 미디어 쿼리 문자열 (예: '(max-width: 640px)')
 * @returns 쿼리 일치 여부
 */
export const useMediaQuery = (query: string): boolean => {
  // 서버 사이드 렌더링 대응
  const getMatches = (query: string): boolean => {
    // 브라우저 환경에서만 window 객체 접근
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // 초기 상태 설정
    setMatches(mediaQuery.matches);
    
    // 리스너 설정
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // 이벤트 리스너 등록 (최신 브라우저)
    mediaQuery.addEventListener('change', handler);
    
    // 클린업 함수
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

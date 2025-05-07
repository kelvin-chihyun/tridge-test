import { QueryClient, DefaultOptions, UseQueryOptions, QueryKey } from "@tanstack/react-query";

// API 요청 함수
export const api = {
  // 포켓몬 종류 목록을 가져오는 함수
  fetchSpeciesList: async (limit: number = 20, offset: number = 0) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error("Failed to fetch species list");
    return response.json();
  },

  // 포켓몬 종류 상세 정보를 가져오는 함수
  fetchSpeciesDetail: async (speciesId: string) => {
    if (!speciesId) return null;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}`);
    if (!response.ok) throw new Error("Failed to fetch species detail");
    return response.json();
  },

  // 포켓몬 상세 정보를 가져오는 함수
  fetchPokemonDetail: async (pokemonId: string) => {
    if (!pokemonId) return null;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) throw new Error("Failed to fetch pokemon detail");
    return response.json();
  },
};

// 기본 쿼리 옵션
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 방지
    refetchOnMount: true, // 컴포넌트 마운트 시 재요청
    refetchOnReconnect: true, // 재연결 시 재요청
    retry: 1, // 실패 시 1번 재시도
    staleTime: 5 * 60 * 1000, // 5분간 데이터 신선 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (v5에서는 cacheTime이 gcTime으로 변경됨)
  },
};

// 쿼리 클라이언트 생성
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

// 공통 쿼리 훅 옵션 생성 함수
export function createQueryOptions<T, E = Error>(key: QueryKey, queryFn: () => Promise<T>, options?: Partial<UseQueryOptions<T, E, T, QueryKey>>): UseQueryOptions<T, E, T, QueryKey> {
  return {
    queryKey: key,
    queryFn,
    ...options,
  };
}

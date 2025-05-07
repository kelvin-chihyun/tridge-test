import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../shared/ui";

// 포켓몬 종류 상세 정보를 가져오는 함수
const fetchSpeciesDetail = async (speciesId: string) => {
  if (!speciesId) return null;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}`);
  if (!response.ok) throw new Error("Failed to fetch species detail");
  return response.json();
};

export const SpeciesOverview = () => {
  // URL 파라미터에서 species ID 가져오기
  const { species } = useParams<{ species: string }>();

  // 포켓몬 종류 데이터 가져오기
  const { data, isLoading, error } = useQuery({
    queryKey: ["species", species],
    queryFn: () => fetchSpeciesDetail(species || ""),
    enabled: !!species,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6 capitalize">{data.name.replace(/-/g, " ")} 개요</h1>

        <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">이름</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{data.name.replace(/-/g, " ")}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">색상</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{data.color?.name || "알 수 없음"}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">서식</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{data.habitat?.name?.replace(/-/g, " ") || "알 수 없음"}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">설명</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {data.flavor_text_entries?.find((entry: { language: { name: string }; flavor_text: string }) => entry.language.name === "ko")?.flavor_text ||
                    data.flavor_text_entries?.find((entry: { language: { name: string }; flavor_text: string }) => entry.language.name === "en")?.flavor_text ||
                    "설명이 없습니다."}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to={`/species/${species}/pokemons`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            포켓몬 목록 보기
          </Link>
        </div>
      </div>
    </Layout>
  );
};

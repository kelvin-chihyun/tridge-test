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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-red-700">데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // 포켓몬 색상에 따른 배경색 지정
  const getColorClass = (colorName: string): string => {
    const colorClasses: Record<string, string> = {
      black: "from-gray-700 to-gray-900",
      blue: "from-blue-500 to-blue-700",
      brown: "from-yellow-700 to-yellow-900",
      gray: "from-gray-400 to-gray-600",
      green: "from-green-500 to-green-700",
      pink: "from-pink-400 to-pink-600",
      purple: "from-purple-500 to-purple-700",
      red: "from-red-500 to-red-700",
      white: "from-gray-100 to-gray-300",
      yellow: "from-yellow-400 to-yellow-600",
    };

    return colorClasses[colorName] || "from-indigo-500 to-indigo-700";
  };

  const colorGradient = getColorClass(data.color?.name || "blue");
  const flavorText =
    data.flavor_text_entries?.find((entry: { language: { name: string }; flavor_text: string }) => entry.language.name === "ko")?.flavor_text ||
    data.flavor_text_entries?.find((entry: { language: { name: string }; flavor_text: string }) => entry.language.name === "en")?.flavor_text ||
    "설명이 없습니다.";

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize">
            <span className="border-b-4 border-indigo-500 pb-2">{data.name.replace(/-/g, " ")} 개요</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className={`bg-gradient-to-br ${colorGradient} rounded-xl shadow-lg overflow-hidden h-full flex flex-col`}>
              <div className="p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold capitalize">{data.name.replace(/-/g, " ")}</h2>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold text-black">#{species}</span>
                </div>

                <div className="mt-6 mb-6 flex justify-center">
                  <div className="w-40 h-40 bg-white bg-opacity-10 rounded-full flex items-center justify-center p-2">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${species}.png`}
                      alt={data.name}
                      className="w-32 h-32 object-contain drop-shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species}.png`;
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-auto pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-opacity-80 text-sm">세대:</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold text-black">
                      {data.generation?.name?.replace(/-/g, " ").replace("generation", "Gen") || "Unknown"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white text-opacity-80 text-sm">희귀도:</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold text-black">
                      {data.is_legendary ? "전설의 포켓몬" : data.is_mythical ? "신화의 포켓몬" : "일반"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white text-opacity-80 text-sm">포획률:</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold text-black">{data.capture_rate || "??"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">기본 정보</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">색상</h3>
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${colorGradient} mr-2`}></div>
                        <span className="text-gray-800 capitalize">{data.color?.name || "알 수 없음"}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">서식</h3>
                      <span className="text-gray-800 capitalize">{data.habitat?.name?.replace(/-/g, " ") || "알 수 없음"}</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">설명</h3>
                      <p className="text-gray-800 italic">"{flavorText.replace(/\f|\n|\r/g, " ")}"</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">추가 정보</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">생애주기:</span>
                        <span className="ml-2 text-gray-800">{data.growth_rate?.name?.replace(/-/g, " ") || "알 수 없음"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">행복도:</span>
                        <span className="ml-2 text-gray-800">{data.base_happiness || "알 수 없음"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">포획랭크:</span>
                        <span className="ml-2 text-gray-800">{data.capture_rate || "알 수 없음"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-start mt-8">
          <Link
            to={`/species/${species}/pokemons`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1"
          >
            포켓몬 목록 보기
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

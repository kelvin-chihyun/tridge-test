import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../shared/ui";
import { api, createQueryOptions } from "../shared/lib/tanstack";
import { PokemonData, SpeciesData } from "../shared/types";
import { getTypeGradient } from "../shared/util";

export const PokemonList = () => {
  // URL 파라미터에서 species ID 가져오기
  const { species } = useParams<{ species: string }>();

  // 포켓몬 종류 데이터 가져오기
  const { data: speciesData, isLoading: isSpeciesLoading } = useQuery<SpeciesData, Error>(
    createQueryOptions(["species", species], () => api.fetchSpeciesDetail(species || ""), { enabled: !!species })
  );

  // 포켓몬 변종 데이터 가져오기 (varieties 기반)
  const pokemonVarieties = speciesData?.varieties || [];

  // 포켓몬 상세 데이터 가져오기
  const { data: pokemonDetailsData, isLoading: isPokemonLoading } = useQuery<PokemonData[], Error>(
    createQueryOptions(
      ["pokemonVarieties", species],
      async () => {
        if (!pokemonVarieties.length) return [];

        // 각 변종의 ID 추출
        const pokemonIds = pokemonVarieties.map((variety) => {
          const url = variety.pokemon.url;
          return url.split("/").filter(Boolean).pop() || "";
        });

        // 변종 데이터 병렬 가져오기
        const pokemonDetails = await Promise.all(
          pokemonIds.map(async (id: string) => {
            if (!id) return null;
            try {
              return await api.fetchPokemonDetail(id);
            } catch (error) {
              console.error(`Error fetching pokemon ${id}:`, error);
              return null;
            }
          })
        );

        return pokemonDetails.filter(Boolean) as PokemonData[];
      },
      { enabled: !!pokemonVarieties.length }
    )
  );

  const isLoading = isSpeciesLoading || isPokemonLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!speciesData) {
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

  // 이미 상단에 정의된 getTypeColor 함수를 사용

  return (
    <Layout>
      <div>
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize">
            <span className="border-b-4 border-indigo-500 pb-2">{speciesData.name.replace(/-/g, " ")} 포켓몬 목록</span>
          </h1>
          <div className="mt-4 md:mt-0 bg-indigo-50 px-4 py-2 rounded-lg">
            <span className="text-indigo-700 font-medium">총 {pokemonDetailsData?.length || 0}개의 포켓몬</span>
          </div>
        </div>

        {pokemonDetailsData && pokemonDetailsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pokemonDetailsData.map(
              (pokemon: {
                id: number;
                name: string;
                sprites?: {
                  front_default?: string;
                  other?: {
                    "official-artwork"?: {
                      front_default?: string;
                    };
                  };
                };
                types?: Array<{
                  type: {
                    name: string;
                  };
                }>;
              }) => {
                if (!pokemon) return null;

                // 포켓몬 ID 추출
                const pokemonId = pokemon.id;
                // 포켓몬 타입 추출
                const types = pokemon.types?.map((typeInfo) => typeInfo.type.name) || [];
                const mainType = types[0] || "normal";
                const typeGradient = getTypeGradient(mainType);

                // 포켓몬 이미지 선택 (공식 아트워크 우선)
                const pokemonImage = pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default;

                return (
                  <Link
                    key={pokemon.id}
                    to={`/species/${species}/pokemons/${pokemonId}`}
                    className="bg-white overflow-hidden shadow-md hover:shadow-xl rounded-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100"
                  >
                    <div className={`h-3 bg-gradient-to-r ${typeGradient}`}></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold capitalize text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">{pokemon.name.replace(/-/g, " ")}</h2>
                        <span className="text-gray-500 font-medium">#{pokemon.id}</span>
                      </div>

                      <div className="mt-4 flex justify-center bg-gray-50 rounded-lg p-4">
                        {pokemonImage ? (
                          <img src={pokemonImage} alt={pokemon.name} className="h-36 w-36 object-contain transform group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="h-36 w-36 bg-gray-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-400">이미지 없음</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {pokemon.types?.map((typeInfo: { type: { name: string } }) => {
                          const typeName = typeInfo.type.name;
                          const typeClass = getTypeGradient(typeName);
                          return (
                            <span key={typeName} className={`px-3 py-1 text-sm font-medium text-white rounded-full capitalize bg-gradient-to-r ${typeClass}`}>
                              {typeName}
                            </span>
                          );
                        })}
                      </div>

                      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-600">상세 정보 보기</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-yellow-700">포켓몬 정보가 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

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

// 포켓몬 상세 정보를 가져오는 함수
const fetchPokemonDetail = async (pokemonId: string) => {
  if (!pokemonId) return null;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  if (!response.ok) throw new Error("Failed to fetch pokemon detail");
  return response.json();
};

export const PokemonList = () => {
  // URL 파라미터에서 species ID 가져오기
  const { species } = useParams<{ species: string }>();

  // 포켓몬 종류 데이터 가져오기
  const { data: speciesData, isLoading: isSpeciesLoading } = useQuery({
    queryKey: ["species", species],
    queryFn: () => fetchSpeciesDetail(species || ""),
    enabled: !!species,
  });

  // 포켓몬 변종 데이터 가져오기 (varieties 기반)
  const pokemonVarieties = speciesData?.varieties || [];

  // 포켓몬 상세 데이터 가져오기
  const { data: pokemonDetailsData, isLoading: isPokemonLoading } = useQuery({
    queryKey: ["pokemonVarieties", species],
    queryFn: async () => {
      if (!pokemonVarieties.length) return [];

      // 각 변종의 ID 추출
      const pokemonIds = pokemonVarieties.map((variety: { pokemon: { url: string } }) => {
        const url = variety.pokemon.url;
        return url.split("/").filter(Boolean).pop() || "";
      });

      // 변종 데이터 병렬 가져오기
      const pokemonDetails = await Promise.all(
        pokemonIds.map(async (id: string) => {
          if (!id) return null;
          try {
            return await fetchPokemonDetail(id);
          } catch (error) {
            console.error(`Error fetching pokemon ${id}:`, error);
            return null;
          }
        })
      );

      return pokemonDetails.filter(Boolean);
    },
    enabled: !!pokemonVarieties.length,
  });

  const isLoading = isSpeciesLoading || isPokemonLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!speciesData) {
    return (
      <Layout>
        <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6 capitalize">{speciesData.name.replace(/-/g, " ")} 포켓몬 목록</h1>

        {pokemonDetailsData && pokemonDetailsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pokemonDetailsData.map(
              (pokemon: {
                id: number;
                name: string;
                sprites?: {
                  front_default?: string;
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

                return (
                  <Link key={pokemon.id} to={`/species/${species}/pokemons/${pokemonId}`} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium capitalize">{pokemon.name.replace(/-/g, " ")}</h2>
                        <span className="text-gray-500">#{pokemon.id}</span>
                      </div>

                      <div className="mt-4 flex justify-center">
                        {pokemon.sprites?.front_default ? (
                          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="h-32 w-32 object-contain" />
                        ) : (
                          <div className="h-32 w-32 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">이미지 없음</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {pokemon.types?.map((typeInfo: { type: { name: string } }) => (
                          <span key={typeInfo.type.name} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded capitalize">
                            {typeInfo.type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div className="text-gray-500">포켓몬 정보가 없습니다.</div>
        )}
      </div>
    </Layout>
  );
};

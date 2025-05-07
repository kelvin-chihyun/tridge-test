import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Layout } from "../shared/ui";

// 포켓몬 상세 정보를 가져오는 함수
const fetchPokemonDetail = async (pokemonId: string) => {
  if (!pokemonId) return null;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  if (!response.ok) throw new Error("Failed to fetch pokemon detail");
  return response.json();
};

// 포켓몬 종류 정보를 가져오는 함수
const fetchSpeciesDetail = async (speciesId: string) => {
  if (!speciesId) return null;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}`);
  if (!response.ok) throw new Error("Failed to fetch species detail");
  return response.json();
};

// 포켓몬 타입에 따른 배경색 지정
const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  return typeColors[type] || "#68A090";
};

export const PokemonDetail = () => {
  // URL 파라미터에서 species와 pokemon ID 가져오기
  const { species, pokemon } = useParams<{ species: string; pokemon: string }>();

  // 포켓몬 종류 데이터 가져오기 - 브레드크럼에서 사용됨
  const { isLoading: isSpeciesLoading } = useQuery({
    queryKey: ["species", species],
    queryFn: () => fetchSpeciesDetail(species || ""),
    enabled: !!species,
  });

  // 포켓몬 상세 데이터 가져오기
  const { data: pokemonData, isLoading: isPokemonLoading } = useQuery({
    queryKey: ["pokemon", pokemon],
    queryFn: () => fetchPokemonDetail(pokemon || ""),
    enabled: !!pokemon,
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

  if (!pokemonData) {
    return (
      <Layout>
        <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </Layout>
    );
  }

  // 포켓몬 타입 가져오기
  const types = pokemonData.types?.map((typeInfo: { type: { name: string } }) => typeInfo.type.name) || [];
  const mainType = types[0] || "normal";
  const mainTypeColor = getTypeColor(mainType);

  return (
    <Layout>
      <div>
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 text-white" style={{ backgroundColor: mainTypeColor }}>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold capitalize">{pokemonData.name.replace(/-/g, " ")}</h1>
              <span className="text-xl font-semibold">#{pokemonData.id}</span>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <div className="md:col-span-1 flex justify-center">
                <div className="p-4">
                  {pokemonData.sprites?.other?.["official-artwork"]?.front_default ? (
                    <img src={pokemonData.sprites.other["official-artwork"].front_default} alt={pokemonData.name} className="h-64 w-64 object-contain" />
                  ) : pokemonData.sprites?.front_default ? (
                    <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className="h-64 w-64 object-contain" />
                  ) : (
                    <div className="h-64 w-64 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">이미지 없음</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">기본 정보</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">타입</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {types.map((type: string) => (
                          <span key={type} className="px-3 py-1 text-sm font-medium text-white rounded capitalize" style={{ backgroundColor: getTypeColor(type) }}>
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">높이 / 무게</h3>
                      <p className="mt-2 text-sm text-gray-900">
                        {pokemonData.height / 10}m / {pokemonData.weight / 10}kg
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">능력</h3>
                      <div className="mt-2">
                        {pokemonData.abilities?.map((abilityInfo: { ability: { name: string }; is_hidden: boolean }) => (
                          <div key={abilityInfo.ability.name} className="text-sm">
                            <span className="capitalize">{abilityInfo.ability.name.replace(/-/g, " ")}</span>
                            {abilityInfo.is_hidden && <span className="ml-2 text-xs text-gray-500">(숨겨진 능력)</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">경험치</h3>
                      <p className="mt-2 text-sm text-gray-900">기본: {pokemonData.base_experience || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t">
                  <h2 className="text-xl font-semibold mb-4">스탯</h2>
                  <div className="space-y-2">
                    {pokemonData.stats?.map((statInfo: { stat: { name: string }; base_stat: number }) => {
                      const statName = statInfo.stat.name.replace(/-/g, " ");
                      const baseStat = statInfo.base_stat;
                      const percentage = Math.min(100, (baseStat / 255) * 100);

                      return (
                        <div key={statInfo.stat.name}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium capitalize">{statName}</span>
                            <span className="text-sm font-medium">{baseStat}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: mainTypeColor,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

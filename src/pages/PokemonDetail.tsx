import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Layout } from "../shared/ui";

// TypeScript 인터페이스 정의
interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

interface PokemonStat {
  stat: {
    name: string;
  };
  base_stat: number;
}

interface PokemonSprites {
  front_default?: string;
  other?: {
    "official-artwork"?: {
      front_default?: string;
    };
  };
}

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites?: PokemonSprites;
  types?: PokemonType[];
  abilities?: PokemonAbility[];
  stats?: PokemonStat[];
}

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

// 포켓몬 타입에 따른 그래디언트 배경색 지정
const getTypeGradient = (type: string): string => {
  const typeGradients: Record<string, string> = {
    normal: "from-gray-400 to-gray-500",
    fire: "from-red-500 to-orange-500",
    water: "from-blue-500 to-blue-600",
    electric: "from-yellow-400 to-yellow-500",
    grass: "from-green-500 to-green-600",
    ice: "from-blue-200 to-blue-300",
    fighting: "from-red-700 to-red-800",
    poison: "from-purple-600 to-purple-700",
    ground: "from-yellow-600 to-yellow-700",
    flying: "from-indigo-300 to-indigo-400",
    psychic: "from-pink-500 to-pink-600",
    bug: "from-green-600 to-green-700",
    rock: "from-yellow-800 to-yellow-900",
    ghost: "from-purple-700 to-purple-800",
    dragon: "from-indigo-600 to-indigo-700",
    dark: "from-gray-700 to-gray-800",
    steel: "from-gray-400 to-gray-500",
    fairy: "from-pink-300 to-pink-400",
  };

  return typeGradients[type] || "from-blue-500 to-indigo-600";
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
  const { data: pokemonData, isLoading: isPokemonLoading } = useQuery<PokemonData, Error>({
    queryKey: ["pokemon", pokemon],
    queryFn: () => fetchPokemonDetail(pokemon || ""),
    enabled: !!pokemon,
  });

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

  if (!pokemonData) {
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

  // 포켓몬 타입 가져오기
  const types = pokemonData.types?.map((typeInfo: { type: { name: string } }) => typeInfo.type.name) || [];
  const mainType = types[0] || "normal";
  const mainTypeGradient = getTypeGradient(mainType);

  return (
    <Layout>
      <div>
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize">
            <span className="border-b-4 border-indigo-500 pb-2">{pokemonData.name.replace(/-/g, " ")}</span>
          </h1>
          <div className="mt-4 md:mt-0 bg-indigo-50 px-4 py-2 rounded-lg">
            <span className="text-indigo-700 font-medium">#{pokemonData.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className={`bg-gradient-to-br ${mainTypeGradient} rounded-xl shadow-lg overflow-hidden h-full`}>
              <div className="p-6 text-white">
                <h2 className="text-2xl font-bold capitalize mb-4">{pokemonData.name.replace(/-/g, " ")}</h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {types.map((type: string) => (
                    <span key={type} className="px-3 py-1 text-sm font-medium bg-white bg-opacity-20 rounded-full capitalize">
                      {type}
                    </span>
                  ))}
                </div>

                <div className="mt-8 bg-white bg-opacity-10 rounded-lg p-6 flex justify-center">
                  {pokemonData.sprites?.other?.["official-artwork"]?.front_default ? (
                    <img src={pokemonData.sprites.other["official-artwork"].front_default} alt={pokemonData.name} className="h-64 w-64 object-contain drop-shadow-lg" />
                  ) : pokemonData.sprites?.front_default ? (
                    <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className="h-64 w-64 object-contain drop-shadow-lg" />
                  ) : (
                    <div className="h-64 w-64 bg-gray-100 bg-opacity-20 flex items-center justify-center rounded-lg">
                      <span className="text-white">이미지 없음</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">기본 정보</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">높이 / 무게</h3>
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                      <p className="text-gray-900 font-medium">
                        {pokemonData.height / 10}m / {pokemonData.weight / 10}kg
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">경험치</h3>
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-gray-900 font-medium">기본: {pokemonData.base_experience || "N/A"}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">능력</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pokemonData.abilities?.map((abilityInfo: { ability: { name: string }; is_hidden: boolean }) => (
                        <div key={abilityInfo.ability.name} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <div>
                            <span className="text-gray-900 font-medium capitalize">{abilityInfo.ability.name.replace(/-/g, " ")}</span>
                            {abilityInfo.is_hidden && <span className="ml-2 text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">(숨겨진 능력)</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">스탯</h2>
                <div className="space-y-4">
                  {pokemonData.stats?.map((statInfo: { stat: { name: string }; base_stat: number }) => {
                    const statName = statInfo.stat.name.replace(/-/g, " ");
                    const baseStat = statInfo.base_stat;
                    const percentage = Math.min(100, (baseStat / 255) * 100);

                    // 스탯에 따른 색상 결정
                    let statColor = "";
                    if (baseStat >= 150) statColor = "from-green-500 to-green-600";
                    else if (baseStat >= 90) statColor = "from-blue-500 to-blue-600";
                    else if (baseStat >= 60) statColor = "from-yellow-400 to-yellow-500";
                    else statColor = "from-red-500 to-red-600";

                    return (
                      <div key={statInfo.stat.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium capitalize text-gray-700">{statName}</span>
                          <span className="text-sm font-bold">{baseStat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className={`h-3 rounded-full bg-gradient-to-r ${statColor}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center md:justify-start">
          <a
            href={`https://www.pokemon.com/us/pokedex/${pokemonData.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1"
          >
            공식 포켓몬 도감에서 보기
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      </div>
    </Layout>
  );
};

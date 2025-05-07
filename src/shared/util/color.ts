// 포켓몬 타입에 따른 그래디언트 배경색 지정
export const getTypeGradient = (type: string): string => {
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

// 포켓몬 색상에 따른 배경색 지정
export const getColorGradient = (colorName: string): string => {
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

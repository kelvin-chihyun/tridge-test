import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Layout } from "../shared/ui";

// 포켓몬 종류 목록을 가져오는 함수
const fetchSpeciesList = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=20");
  if (!response.ok) throw new Error("Failed to fetch species list");
  return response.json();
};

export const SpeciesList = () => {
  // 포켓몬 종류 데이터 가져오기
  const { data, isLoading, error } = useQuery({
    queryKey: ["speciesList"],
    queryFn: fetchSpeciesList,
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

  if (error) {
    return (
      <Layout>
        <div className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6">포켓몬 종류 목록</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.results.map((species: { name: string; url: string }) => {
            // URL에서 ID 추출
            const id = species.url.split("/").filter(Boolean).pop();
            return (
              <Link key={species.name} to={`/species/${id}`} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="capitalize font-medium">{species.name.replace(/-/g, " ")}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-700">데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="border-b-4 border-indigo-500 pb-2">포켓몬 종류 목록</span>
          </h1>
          <p className="text-gray-600 mt-2 md:mt-0">총 {data?.results.length || 0}개의 포켓몬 종류</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.results.map((species: { name: string; url: string }, index: number) => {
            // URL에서 ID 추출
            const id = species.url.split("/").filter(Boolean).pop();
            // 색상 그래디언트 배열 - 원하는 만큼 추가
            const gradients = [
              "from-blue-500 to-indigo-600",
              "from-indigo-500 to-purple-600",
              "from-purple-500 to-pink-600",
              "from-pink-500 to-red-600",
              "from-red-500 to-yellow-600",
              "from-yellow-500 to-green-600",
              "from-green-500 to-teal-600",
              "from-teal-500 to-cyan-600",
              "from-cyan-500 to-blue-600"
            ];
            const gradientClass = gradients[index % gradients.length];
            
            return (
              <Link 
                key={species.name} 
                to={`/species/${id}`} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
              >
                <div className={`h-3 bg-gradient-to-r ${gradientClass}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold capitalize text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
                      {species.name.replace(/-/g, " ")}
                    </h2>
                    <span className="text-gray-500 text-sm">#{id}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">자세히 보기</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

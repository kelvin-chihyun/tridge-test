import { Link } from "react-router-dom";
import { Layout } from "../shared/ui";

export const Home = () => {
  return (
    <Layout>
      <div className="text-3xl flex flex-col space-y-4">
        <h1 className="text-4xl font-bold mb-6">포켓몬 탐험을 시작하세요!</h1>
        <div className="flex flex-col space-y-2">
          <Link to="/species" className="text-blue-600 hover:underline">
            포켓몬 종류 목록
          </Link>
        </div>
      </div>
    </Layout>
  );
};

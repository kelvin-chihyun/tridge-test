import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BreadcrumbItem } from "../ui";
import { api, createQueryOptions } from "../lib";
import { PokemonData, SpeciesData } from "../types";

/**
 * 현재 경로에 따라 브레드크럼 아이템을 생성하는 훅
 */
export const useBreadcrumb = () => {
  const location = useLocation();
  const params = useParams<{ species?: string; pokemon?: string }>();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  // 포켓몬 종(species) 데이터 가져오기
  const { data: speciesData, isLoading: isSpeciesLoading } = useQuery<SpeciesData, Error>(
    createQueryOptions(
      ["species", params.species],
      () => api.fetchSpeciesDetail(params.species || ""),
      { enabled: !!params.species }
    )
  );

  // 포켓몬 데이터 가져오기
  const { data: pokemonData, isLoading: isPokemonLoading } = useQuery<PokemonData, Error>(
    createQueryOptions(
      ["pokemon", params.pokemon],
      () => api.fetchPokemonDetail(params.pokemon || ""),
      { enabled: !!params.pokemon }
    )
  );

  // 로딩 상태 확인
  const isLoading = (!!params.species && isSpeciesLoading) || (!!params.pokemon && isPokemonLoading);

  // 경로 변경시 브레드크럼 아이템 업데이트
  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // 홈 항상 추가
    items.push({
      label: "Home",
      path: "/",
      isActive: location.pathname === "/",
    });

    // 경로에 따라 아이템 추가
    if (pathSegments.length > 0) {
      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];

        // species 목록
        if (i === 0 && segment === "species") {
          items.push({
            label: "Pokemon Species List",
            path: "/species",
            isActive: location.pathname === "/species",
          });
        }

        // 특정 species 개요
        else if (i === 1 && pathSegments[0] === "species") {
          const speciesName = speciesData?.name || params.species;
          const formattedName = speciesName ? speciesName.charAt(0).toUpperCase() + speciesName.slice(1) + " Overview" : "Loading...";

          items.push({
            label: formattedName,
            path: `/species/${params.species}`,
            isActive: location.pathname === `/species/${params.species}`,
          });
        }

        // 포켓몬 목록
        else if (i === 2 && segment === "pokemons") {
          items.push({
            label: "Pokemon List",
            path: `/species/${params.species}/pokemons`,
            isActive: location.pathname === `/species/${params.species}/pokemons`,
          });
        }

        // 특정 포켓몬 상세
        else if (i === 3 && pathSegments[2] === "pokemons") {
          const pokemonName = pokemonData?.name || params.pokemon;
          const formattedName = pokemonName ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) : "Loading...";

          items.push({
            label: formattedName,
            path: `/species/${params.species}/pokemons/${params.pokemon}`,
            isActive: true,
          });
        }
      }
    }

    setBreadcrumbItems(items);
  }, [location.pathname, params.species, params.pokemon, speciesData, pokemonData]);

  return {
    breadcrumbItems,
    isLoading,
  };
};

// TypeScript 인터페이스 정의
export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

export interface PokemonStat {
  stat: {
    name: string;
  };
  base_stat: number;
}

export interface PokemonSprites {
  front_default?: string;
  other?: {
    "official-artwork"?: {
      front_default?: string;
    };
  };
}

export interface PokemonData {
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

export interface SpeciesVariety {
  pokemon: {
    name: string;
    url: string;
  };
}

export interface SpeciesData {
  id: number;
  name: string;
  color?: {
    name: string;
  };
  habitat?: {
    name: string;
  };
  generation?: {
    name: string;
  };
  growth_rate?: {
    name: string;
  };
  is_legendary: boolean;
  is_mythical: boolean;
  capture_rate: number;
  base_happiness: number;
  flavor_text_entries?: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  varieties: SpeciesVariety[];
}

// UI 관련 타입
export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}

import { Route, Routes } from "react-router-dom";
import { Home, SpeciesOverview, PokemonList, PokemonDetail, SpeciesList } from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/species" element={<SpeciesList />} />
      <Route path="/species/:species" element={<SpeciesOverview />} />
      <Route path="/species/:species/pokemons" element={<PokemonList />} />
      <Route path="/species/:species/pokemons/:pokemon" element={<PokemonDetail />} />
    </Routes>
  );
}

export default App;

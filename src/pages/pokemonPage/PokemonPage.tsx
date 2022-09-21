import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Pokemon from "../../components/pokemon/Pokemon";
import { Container, Grid, ContainerButton, Button, IconImage } from "./styles";
import { IFetchedResults, IFetchedPokemon, IPokemonData } from "./../../types";
import { useSearchStore } from "./../../stores/search";
import frontArrow from "./../../assets/front.png";
import backArrow from "./../../assets/back.png";
import { Link } from "react-router-dom";
import {
  fetchPokemons,
  fetchPokemonData,
} from "./../../services/pokemon-service";

const URL = "https://pokeapi.co/api/v2/pokemon";

function PokemonPage() {
  const [pokemonInfo, setPokemonInfo] = useState<(IFetchedPokemon | undefined)[]>([]);
  const [singlePokemon, setSinglePokemon] = useState<(IFetchedPokemon | undefined )[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  //aqui o state hook do zustand
  const searchInput = useSearchStore((state) => state.search);

  useEffect(() => {
    if (searchInput) fetchSinglePokemon();
    else fetchAllPokemon();

    //????
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, currentPage]);

  const fetchAllPokemon = async () => {
    //funçao do service
    const pokemonResults: IFetchedResults[] | undefined = await fetchPokemons(
      URL,
      currentPage
    );

    //Promise all porque vamos iterar sobre 1 array de promises e quero que todas se resolvam antes de retornar
    const pokemonInfo = await Promise.all(
      (pokemonResults as IFetchedResults[]).map(
        async (pokemon: IFetchedResults) => {
          //para aceder a prop url dentro dos results:
          const data = await fetchPokemonData(pokemon.url, null);
          return data;
        /*   return {
            image: data?.sprites?.front_default,
            id: data?.id,
            name: data?.forms[0].name,
            ability: data?.abilities[0].ability.name,
            experience: data?.base_experience,
            height: data?.height,
            weight: data?.weight,
          } as IPokemonData;
        } */
  })
    );
    setPokemonInfo(pokemonInfo);
  };


  //vou buscar 1 unico pokemon através do searchInput e guardo na info para renderizar
  const fetchSinglePokemon = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchInput}`
    );
    const data = (await response.json()) as IFetchedPokemon[];
    setSinglePokemon(data);
    /* ([
      {
        image: data?.sprites?.front_default,
        id: data.id,
        name: data.forms[0].name,
        ability: data?.abilities[0].ability.name,
        experience: data?.base_experience,
        height: data?.height,
        weight: data?.weight,
      } as IPokemonData,
    ]); */
  };

  const pageButtons = () => (
    <ContainerButton>
      <Button onClick={() => setCurrentPage((prev) => prev + 1)}>
        {/*automaticamente vai buscar o ultimo state*/}
        <IconImage src={backArrow} alt="Previous" />
      </Button>
      <Button onClick={() => setCurrentPage((prev) => prev - 1)}>
        <IconImage src={frontArrow} alt="Next" />
      </Button>
    </ContainerButton>
  );

  return (
    <>
      <Header />
      <Container>
        <Grid>
          
          {singlePokemon ? 
          
          singlePokemon.map((pokemon, index) => {
            return (
              <Link key={index} to={`/pokemon/${pokemon?.id}`}>
                <Pokemon pokemon={pokemon} />
              </Link>
            );
          })
:

          pokemonInfo.map((pokemon, index) => {
            return (
              <Link key={index} to={`/pokemon/${pokemon?.id}`}>
                <Pokemon pokemon={pokemon} />
              </Link>
            );
          })}
        </Grid>
        {pageButtons()}
      </Container>
    </>
  );
}

//teste
export default PokemonPage;

/* eslint-disable @next/next/no-img-element */
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
const btn =
  "items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.pokemon.getPokemonById.useQuery({ id: first });
  const secondPokemon = trpc.pokemon.getPokemonById.useQuery({ id: second });

  const voteMutation = trpc.pokemon.castVote.useMutation();

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ voteFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ voteFor: second, votedAgainst: first });
    }
    setIds(getOptionsForVote());
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl">Which pokemon is rounder</div>
      <div className="p-2"></div>
      <div className="flex max-w-2xl items-center justify-between rounded border p-8">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">VS</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}
        <div className="p-2" />
      </div>
      <div className="absolute bottom-0 w-full pb-2 text-center text-xl">
        <Link href="/results">
          <p>Results</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;

const PokemonListing: React.FC<{ pokemon: any; vote: () => void }> = (
  props
) => {
  return (
    <div className=" flex flex-col items-center">
      <Image
        src={props.pokemon.spriteUrl}
        alt="first pokemon"
        width={256}
        height={256}
      />
      <div className="mt-[-2rem] text-center text-xl capitalize">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};

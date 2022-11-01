import type { GetServerSideProps } from "next";
import { prisma } from "@/server/db/client";
import type { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryType = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryType[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) {
    return 0;
  }
  return (VoteFor / (VoteAgainst + VoteFor)) * 100;
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryType[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex items-center justify-between border-b p-2">
      <div className="flex items-center">
        <Image
          src={pokemon.spriteUrl}
          width={64}
          height={64}
          alt="pokemon Logo"
        />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-2">{generateCountPercent(pokemon) + "%"}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryType;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="p-4 text-2xl">Results</h2>
      <div className="flex w-full max-w-2xl flex-col border">
        {props.pokemon
          .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
          .map((currentPokemon, index) => {
            return <PokemonListing key={index} pokemon={currentPokemon} />;
          })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered } };
};

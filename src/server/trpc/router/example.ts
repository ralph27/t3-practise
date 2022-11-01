import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { PokemonClient } from "pokenode-ts";

export const pokemonRouter = router({
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const pokemon = await prisma.pokemon.findFirst({
        where: { id: input.id },
      });

      if (pokemon) {
        return pokemon;
      }
    }),
  castVote: publicProcedure
    .input(z.object({ voteFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          votedForId: input.voteFor,
          votedAgainstId: input.votedAgainst,
        },
      });
      return {
        success: true,
        vote: voteInDb,
      };
    }),
});

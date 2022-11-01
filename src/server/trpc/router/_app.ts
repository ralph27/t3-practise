import { router } from "../trpc";
import { pokemonRouter } from "./example";

export const appRouter = router({
  pokemon: pokemonRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

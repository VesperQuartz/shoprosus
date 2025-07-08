import { env } from "@/env/server";
import neo4j from "neo4j-driver";

export const driver = neo4j.driver(
  env.neo4jUri,
  neo4j.auth.basic(env.neo4jUsername, env.neo4jPassword),
);

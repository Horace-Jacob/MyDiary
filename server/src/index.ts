import express from "express";
import { DataSource } from "typeorm";
import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import dotEnv from "dotenv";
import { Admin } from "./Entity/Admin";
import { Post } from "./Entity/Post";
import { AdminResolver } from "./resolvers/AdminResolver";
import { PostResolver } from "./resolvers/PostResolver";
import { HelloResolver } from "./resolvers/HelloResolver";
import cors from "cors";

dotEnv.config();

const PORT = process.env.RUNNING_PORT;

export const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  host: "localhost",
  username: "postgres",
  password: process.env.DATABASE_PASSWORD,
  database: "diary",
  logging: true,
  synchronize: true,
  entities: [Admin, Post],
});

AppDataSource.initialize()
  .then(() => {})
  .catch((error) => {
    console.log(error);
  });

const main = async () => {
  const app = express();

  app.use(express());

  app.use(bodyParser.json({ limit: "30mb" }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: "did",
      store: new RedisStore({
        client: redis,
        disableTouch: false,
      }),
      secret: "ajsdfihqengahdgbansdiguausdg",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        sameSite: "lax",
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, AdminResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`);
  });
};

main();

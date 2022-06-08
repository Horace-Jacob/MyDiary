import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import {
  createClient,
  Provider,
  dedupExchange,
  fetchExchange,
  Exchange,
} from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { UpdateQuery } from "./utils/updateQuery";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
} from "./generated/graphql";
import { pipe, tap } from "wonka";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        const navigate = useNavigate();
        if (error?.message.includes("not authenticated")) {
          navigate("/login");
        }
      })
    );
  };

const myCacheExchange = cacheExchange({
  updates: {
    Mutation: {
      logout: (_result, args, cache, info) => {
        UpdateQuery<LogoutMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          () => ({ me: null })
        );
      },

      login: (_result, args, cache, info) => {
        UpdateQuery<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.login.errors) {
              return query;
            } else {
              return {
                me: result.login.admin,
              };
            }
          }
        );
      },
    },
  },
});

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [dedupExchange, fetchExchange, myCacheExchange, errorExchange],
});

const App = () => {
  return (
    <Provider value={client}>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  );
};

export default App;

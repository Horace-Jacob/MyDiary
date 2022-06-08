import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const [{ data, fetching }] = useMeQuery();
  const navigate = useNavigate();
  useEffect(() => {
    if (!fetching && !data?.me) {
      navigate("/login");
    }
  }, [fetching, data, navigate]);
};

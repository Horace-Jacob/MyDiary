import { Flex, HStack, Text, Button, Stack } from "@chakra-ui/react";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  let body = null;
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const logoutHandling = () => {
    logout();
  };
  const signInHandle = () => {
    navigate("/login");
  };
  if (!fetching) {
  } else if (!data?.me) {
    body = <></>;
  }
  return (
    <Flex
      position={"sticky"}
      bg={"teal.100"}
      padding={4}
      top={0}
      zIndex={1}
      justify={"space-between"}
    >
      <HStack spacing="4">
        <Text
          fontSize="2xl"
          color="blue.900"
          fontWeight={"bold"}
          whiteSpace="nowrap"
        >
          Horace's Diary
        </Text>
      </HStack>
      <HStack spacing="4">
        {data?.me ? (
          <Text
            fontSize="2xl"
            color="blue.900"
            fontWeight={"bold"}
            whiteSpace="nowrap"
          >
            {" "}
            Hello, {data.me.username}{" "}
          </Text>
        ) : (
          <Text
            fontSize="2xl"
            color="blue.900"
            fontWeight={"bold"}
            whiteSpace="nowrap"
          >
            {" "}
            Please Sign In{" "}
          </Text>
        )}
      </HStack>
      <Stack spacing="4">
        {data?.me ? (
          <Button
            width={"28"}
            height={"9"}
            variant={"primary"}
            colorScheme={"telegram"}
            bgColor={"teal.300"}
            fontSize="lg"
            onClick={logoutHandling}
            isLoading={logoutFetching}
          >
            Logout
          </Button>
        ) : (
          <Button
            width={"28"}
            height={"9"}
            variant={"primary"}
            colorScheme={"telegram"}
            bgColor={"teal.300"}
            fontSize="lg"
            onClick={signInHandle}
          >
            Sign In
          </Button>
        )}
      </Stack>
    </Flex>
  );
};

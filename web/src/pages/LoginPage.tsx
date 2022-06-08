import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Logo } from "../components/Logo";
import { useLoginMutation } from "../generated/graphql";
import { ErrorMap } from "../utils/ErrorMap";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [, login] = useLoginMutation();
  const navigate = useNavigate();
  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
              Log in to your account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Don't have an account?</Text>
              <Button variant="link" colorScheme="blue">
                Sign up
              </Button>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={useBreakpointValue({ base: "transparent", sm: "bg-surface" })}
          boxShadow={{ base: "none", sm: useColorModeValue("md", "md-dark") }}
          borderRadius={{ base: "none", sm: "xl" }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <Formik
                initialValues={{
                  email: "",
                  secret: "",
                  password: "",
                }}
                onSubmit={async (values, { setErrors }) => {
                  const response = await login(values);
                  if (response.data?.login.errors) {
                    setErrors(ErrorMap(response.data.login.errors));
                  } else if (response.data?.login.admin) {
                    navigate("/");
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <InputField
                      name="email"
                      placeholder="Enter Your Email"
                      label="Email"
                    />

                    <Box mt={4}>
                      <InputField
                        name="secret"
                        type={"password"}
                        placeholder="Enter Your Secret"
                        label="Secret"
                      />
                    </Box>

                    <Box mt={4}>
                      <InputField
                        name="password"
                        type={"password"}
                        placeholder="Enter Your Password"
                        label="Password"
                      />
                    </Box>

                    <Box mt={4}>
                      <HStack justify="space-between">
                        <Button variant="link" colorScheme="blue" size="sm">
                          Forgot password?
                        </Button>
                      </HStack>
                    </Box>

                    <Stack spacing="6" mt="4">
                      <Button
                        variant={"primary"}
                        colorScheme={"telegram"}
                        bgColor={"teal.300"}
                        type={"submit"}
                        isLoading={isSubmitting}
                      >
                        Sign In
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Stack>
            {/* <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="link" colorScheme="blue" size="sm">
                Forgot password?
              </Button>
            </HStack> */}
            {/* <Stack spacing="6">
              <Button variant="primary">Sign in</Button>
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
            </Stack> */}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

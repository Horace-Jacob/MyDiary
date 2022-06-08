import { Box, Button, Stack, Textarea, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useCreatePostMutation } from "../generated/graphql";
import { Auth } from "../utils/Auth";

export const Diary = () => {
  Auth();
  const navigate = useNavigate();
  const [, createPost] = useCreatePostMutation();
  const toast = useToast();
  return (
    <>
      <Formik
        initialValues={{
          text: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost(values);
          if (response.error) {
            toast({
              title: "Error",
              description: "Cannot upload to server",
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          } else if (response.data?.createPost) {
            navigate("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <Textarea
                name="text"
                placeholder="Write Something"
                size="lg"
                resize={"vertical"}
                height="2xl"
              />
            </Box>

            <Stack spacing="6" mt="4">
              <Button
                variant={"primary"}
                colorScheme={"telegram"}
                bgColor={"teal.300"}
                type={"submit"}
                isLoading={isSubmitting}
              >
                Upload Daily Diary
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
};

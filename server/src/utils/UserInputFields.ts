import { Field, InputType } from "type-graphql";

@InputType()
export class UserInputFields {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  secret: string;
}

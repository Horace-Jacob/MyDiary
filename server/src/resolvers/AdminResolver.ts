import { Admin } from "../Entity/Admin";
import bcrypt from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "../context";
import { validateRegister } from "../utils/validateRegister";
import { UserInputFields } from "../utils/UserInputFields";
import { AppDataSource } from "..";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class AdminResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Admin, { nullable: true })
  admin?: Admin;
}

@Resolver(Admin)
export class AdminResolver {
  @Mutation(() => AdminResponse)
  async register(
    @Arg("fields") fields: UserInputFields
  ): Promise<AdminResponse> {
    const errors = validateRegister(fields);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await bcrypt.hash(fields.password, 12);
    const hashedSecret = await bcrypt.hash(fields.secret, 12);

    let admin;

    try {
      const result = await AppDataSource.createQueryBuilder()
        .insert()
        .into(Admin)
        .values({
          email: fields.email,
          password: hashedPassword,
          username: fields.username,
          secret: hashedSecret,
        })
        .returning("*")
        .execute();
      admin = result.raw[0];
    } catch (error) {
      return {
        errors: [
          {
            field: "email",
            message: "There is an error with this email",
          },
        ],
      };
    }
    return { admin };
  }

  @Mutation(() => AdminResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("secret") secret: string,
    @Ctx() { req }: Context
  ): Promise<AdminResponse> {
    const admin = await Admin.findOneBy({ email });
    if (!admin) {
      return {
        errors: [
          {
            field: "email",
            message: "Email doesn't exist",
          },
        ],
      };
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }
    const secretKeyCheck = await bcrypt.compare(secret, admin.secret);
    if (!secretKeyCheck) {
      return {
        errors: [
          {
            field: "secret",
            message: "Incorrect secret key",
          },
        ],
      };
    }

    req.session.userId = admin.id;
    return { admin };
  }

  @Query(() => Admin, { nullable: true })
  me(@Ctx() { req }: Context) {
    const currentAccountId = req.session.userId;

    if (!currentAccountId) {
      return null;
    }
    const findAccounts = AppDataSource.getRepository(Admin);

    return findAccounts.findOneBy({ id: currentAccountId });
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie("did");
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}

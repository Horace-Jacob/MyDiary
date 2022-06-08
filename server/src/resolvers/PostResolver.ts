import { Post } from "../Entity/Post";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { Context } from "../context";

@Resolver(Post)
export class PostResolver {
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg("text") text: string,
    @Ctx() { req }: Context
  ): Promise<Post> {
    return Post.create({
      text,
      creatorId: req.session.userId,
    }).save();
  }
}

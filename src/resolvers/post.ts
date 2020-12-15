import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../entity/user";
import { Post } from "../entity/post";
import { PostRequest, UpdatePostRequest } from "../dto/post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async getPosts() {
    return await Post.find({ relations: ["user", "user.posts"] });
  }

  @Query(() => [Post])
  async getPostsByUser(@Arg("id") id: number) {
    return await Post.find({ where: { writerId: id } });
  }

  @Query(() => Post, { nullable: true })
  async getSinglePost(@Arg("id") id: number) {
    try {
      return await Post.findOne({ where: { id } });
    } catch (e) {
      return e;
    }
  }

  @Mutation(() => Boolean)
  async writePost(@Arg("id") id: number, @Arg("data") data: PostRequest) {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) throw new Error("User not exist");
      const { title, content } = data;
      await Post.insert({ title, content, user });
      return true;
    } catch (e) {
      return e;
    }
  }

  @Mutation(() => Boolean)
  async updatePost(
    @Arg("id") id: number,
    @Arg("data") data: UpdatePostRequest
  ) {
    try {
      const post = await Post.findOne({ where: { id } });
      if (!post) throw new Error("post not found");
      Object.assign(post, data);
      await post.save();
      return true;
    } catch (e) {
      return e;
    }
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number) {
    try {
      const post = await Post.findOne({ where: { id } });
      if (!post) throw new Error("post not found");
      await post.remove();
      return true;
    } catch (e) {
      return e;
    }
  }
}

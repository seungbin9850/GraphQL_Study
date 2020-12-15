import { InputType, Field } from "type-graphql";
import { Post } from "../entity/post";

@InputType()
export class PostRequest implements Partial<Post> {
  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;
}

@InputType()
export class UpdatePostRequest implements Partial<Post> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;
}

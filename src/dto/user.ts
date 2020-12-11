import { InputType, Field, ObjectType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { User } from "../entity/user";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}

@InputType()
export class LoginRequest implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 12)
  password: string;
}

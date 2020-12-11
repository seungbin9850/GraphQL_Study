import {
  Mutation,
  Query,
  Resolver,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import * as bcrypt from "bcryptjs";
import { User } from "../entity/user";

@Resolver(User)
export class RegisterResolver {
  @Query(() => String, { name: "helloWorld" })
  async hello() {
    return "hello world";
  }

  @Query(() => User)
  async getUser(@Arg("id") id: number): Promise<User> {
    const user: any = await User.findOne({ where: { id } });
    return user;
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();
    return user;
  }
}
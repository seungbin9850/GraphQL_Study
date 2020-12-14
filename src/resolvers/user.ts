import {
  Mutation,
  Query,
  Resolver,
  Arg,
  FieldResolver,
  Root,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import * as bcrypt from "bcryptjs";
import { User } from "../entity/user";
import { LoginRequest, LoginResponse } from "../dto/user";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { Context } from "../dto/context";
import { isAuth } from "../middleware/auth";

@Resolver(User)
export class RegisterResolver {
  @Query(() => String, { name: "helloWorld", nullable: false })
  async hello() {
    return "hello world";
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async getUser(@Ctx() { payload }: Context): Promise<User> {
    const user: any = await User.findOne({ where: { id: payload!.id } });
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg("data") data: LoginRequest,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const { email, password } = data;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not exists");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Password not mached");
    res.cookie("jid", generateRefreshToken(user.id, user.tokenVersion), {
      httpOnly: true,
    });
    return { accessToken: await generateAccessToken(user.id) };
  }
}

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Post } from "./post";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @OneToMany(() => Post, (post) => post.user)
  @Field(() => [Post])
  posts: Post[];

  @Field()
  name: string;
}

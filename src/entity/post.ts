import { Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import User from "./user";

@Entity()
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column("timestamptz")
  @CreateDateColumn()
  createdAt: string;

  @Column("timestamptz")
  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  @Field(() => User)
  @JoinColumn({ name: "writerId" })
  user: User;
}

import {
  Entity,
  Column,
  AfterLoad,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { IsNotEmpty, IsEnum, Length } from "class-validator";
import { BaseEntity } from "./base-entitiy";
import { User } from "./user-entity";

@Entity()
export class Tour extends BaseEntity {
  @Column({ length: 40, unique: true })
  @IsNotEmpty({ message: "Please enter name" })
  @Length(10, 40, { message: "A tour name must be between 10 and 40 characters" })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: "float" })
  @IsNotEmpty({ message: "Please enter rating" })
  rating: number;

  @Column({ type: "float" })
  @IsNotEmpty({ message: "Please enter price" })
  price: number;

  @Column({ type: "int", nullable: true })
  duration: number;

  @Column({ type: "int", nullable: true })
  maxGroupSize: number;

  @Column({ type: "enum", enum: ["easy", "medium", "difficult"] })
  @IsNotEmpty({ message: "A tour must have a difficulty" })
  @IsEnum(["easy", "medium", "difficult"], {
    message: "Difficulty is either: easy, medium, difficult",
  })
  difficulty: "easy" | "medium" | "difficult";

  @Column({ type: "float", nullable: true })
  ratingsAverage: number;

  @Column({ type: "int", nullable: true })
  ratingsQuantity: number;

  @Column({ type: "text", nullable: true })
  summary: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar" })
  @IsNotEmpty({ message: "Please add an image cover" })
  imageCover: string;

  @Column({ type: "simple-array", nullable: true })
  images: string[];

  @Column({ type: "simple-array", nullable: true })
  startDates: string[];
  
  // A tour is created by a single user/guide
  @ManyToOne(() => User, (user) => user.tours, {onUpdate: "CASCADE"})
  user: User;

  // Many users can book multiple tours
  @ManyToMany(() => User, (user) => user.bookedTours)
  bookedUsers: User[];

  // Virtual field for durationWeeks
  durationWeeks: number;

  @AfterLoad()
  calculateDurationWeeks() {
    if (this.duration) {
      this.durationWeeks = this.duration / 7;
    }
  }
}

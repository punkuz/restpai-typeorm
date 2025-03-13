import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./base-entitiy";
import { User } from "./user-entity";
import { IsString, IsInt, IsPhoneNumber, Min, Max, IsNotEmpty } from "class-validator";

@Entity()
export class Profile extends BaseEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsInt()
  @Min(0) // Assuming age cannot be negative
  @Max(100) // Reasonable maximum age
  age: number;

  @Column()
  @IsPhoneNumber("NP") // Validates against any locale's phone number format
  @IsNotEmpty()
  phoneNumber: string;

  //If the User ID changes, the corresponding Profile record updates automatically.
  @OneToOne(() => User, (user) => user.profile, { onUpdate: "CASCADE" })
  @JoinColumn()
  user: User;
}

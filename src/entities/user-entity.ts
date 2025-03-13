import { Entity, Column, BeforeInsert, BeforeUpdate, OneToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { IsEmail, IsEnum, IsNotEmpty, Length } from "class-validator";
import NodeError from "../extra/node-error";
import { StatusCodes } from "../constants/status-codes";
import { BaseEntity } from "./base-entitiy";
import { Profile } from "./profile-entity";
import { Tour } from "./tour-entity";

@Entity()
// @Unique(["email"]) // Ensure email uniqueness
export class User extends BaseEntity {
  @Column({ length: 350, unique: true })
  @IsNotEmpty({ message: "Please enter your username!" })
  username: string;

  @Column({ unique: true })
  @IsEmail({}, { message: "Please provide a valid email!" })
  email: string;

  @Column({ nullable: true })
  uniqueSlug?: string;

  @Column({ type: "enum", enum: ["user", "admin", "guide"], default: "user" })
  @IsNotEmpty({ message: "Please provide a role!" })
  @IsEnum(["user", "admin", "guide"], {
    message: "Role must be either 'user' or 'admin' or 'guide!",
  })
  role: "user" | "admin" | "guide";

  @Column({ select: false })
  @IsNotEmpty({ message: "Please provide a password!" })
  @Length(8, 50, { message: "Password must be between 8 and 50 characters!" })
  password: string;

  @Column({ select: false, nullable: true })
  @IsNotEmpty({ message: "Please confirm your password!" })
  passwordConfirm?: string;

  @Column({ type: "timestamp", nullable: true })
  passwordChangedAt?: Date;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ type: "timestamp", nullable: true })
  passwordResetExpires?: Date;

  @Column({ default: true, select: false })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isPermanentDeleted: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastLogin?: Date;

  //If a User is deleted, their corresponding Profile will also be deleted.
  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: "CASCADE" })
  profile: Profile;

  //A user/guide can create multiple tours
  @OneToMany(() => Tour, (tour) => tour.user, { onDelete: "CASCADE" })
  tours: Tour[];

  // A user can book multiple tours
  @ManyToMany(() => Tour, (tour) => tour.bookedUsers, {cascade: ["insert", "update"]})
  @JoinTable()
  bookedTours: Tour[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password !== this.passwordConfirm) {
      throw new NodeError("Passwords do not match!", StatusCodes.BAD_REQUEST);
    }
    if (this.password && this.password.length >= 8) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    this.passwordConfirm = undefined; // Assign `null` instead of `undefined`
  }

  @BeforeUpdate()
  updatePasswordChangedAt() {
    if (this.password) {
      this.passwordChangedAt = new Date(Date.now() - 1000);
    }
  }

  async correctPassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  changedPasswordAfter(JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
      return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
  }

  createPasswordResetToken(): string {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    return resetToken;
  }
}

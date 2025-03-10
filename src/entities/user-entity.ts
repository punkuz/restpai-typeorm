import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { IsEmail, IsEnum, IsNotEmpty, Length } from "class-validator";

@Entity()
// @Unique(["email"]) // Ensure email uniqueness
export class User {
  @PrimaryGeneratedColumn("increment")
  id: string;

  @Column({ length: 350, unique: true })
  @IsNotEmpty({ message: "Please enter your username!" })
  username: string;

  @Column({ unique: true})
  @IsEmail({}, { message: "Please provide a valid email!" })
  email: string;

  @Column({ nullable: true })
  uniqueSlug?: string;

  @Column({ type: "enum", enum: ["user", "admin"], default: "user" })
  @IsNotEmpty({ message: "Please provide a role!" })
  @IsEnum(["user", "admin"], { message: "Role must be either 'user' or 'admin'!" })
  role: "user" | "admin";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
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

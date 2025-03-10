import { Repository } from "typeorm";
import { User } from "../entities/user-entity"
import AppDataSource from "../server"
export const userRepo = () => {
  let userRepo: Repository<User>;
  if (!userRepo) {
    userRepo = AppDataSource.getRepository(User);
  }
  return userRepo;
}
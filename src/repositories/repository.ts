import { Repository } from "typeorm";
import { User } from "../entities/user-entity"
import AppDataSource from "../server"
import { Profile } from "../entities/profile-entity";
export const userRepo = () => {
  let userRepo: Repository<User>;
  if (!userRepo) {
    userRepo = AppDataSource.getRepository(User);
  }
  return userRepo;
}

export const profileRepo = () => {
  let profileRepo: Repository<Profile>;
  if (!profileRepo) {
    profileRepo = AppDataSource.getRepository(Profile);
  }
  return profileRepo;
}
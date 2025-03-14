import { Repository } from "typeorm";
import { User } from "../entities/user-entity"
import AppDataSource from "../server"
import { Profile } from "../entities/profile-entity";
import { Tour } from "../entities/tour-entity";
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

export const tourRepo = () => {
  let tourRepo: Repository<Tour>;
  if (!tourRepo) {
    tourRepo = AppDataSource.getRepository(Tour);
  }
  return tourRepo;
}
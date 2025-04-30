import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  getAllUsers() {
    return "List of users";
  }
}

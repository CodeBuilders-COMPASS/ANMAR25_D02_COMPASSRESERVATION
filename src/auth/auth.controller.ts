import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthController {
  constructor() {
    // Constructor logic if needed
  }
  async createToken(){
    //return this.jwtService.signAsync({ id: user.id });
    // Logic to create a token
  }
  async checkToken(){
    // return this.jwtService.verifyAsync(token);
  }
}

import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { publicAPIs } from "src/utils/publicAPIs";
import { privateAPIs } from "src/utils/privateAPIs";
import { UsersService } from "src/users/users.service";

@Injectable()
export class TokenAuthorizationMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: any, res: any, next: () => void) {
    //Find whether the current API is public or private
    let isAPIPublic: boolean = false;
    let isAPIPrivate: boolean = false;
    publicAPIs.map(api => {
      if (req.url.includes(api)) {
        isAPIPublic = true;
      }
    });
    privateAPIs.map(api => {
      if (req.url.includes(api)) {
        isAPIPrivate = true;
      }
    });

    //If API is public, don't check for bearer token, else if it is private, check for bearer token
    if (isAPIPublic) {
      //If API is public, don't check for bearer token
      next();
    } else {
      if (isAPIPrivate) {
        //If API is private, check for bearer token
        if (req.headers.authorization) {
          //Extract token from headers authorization string
          let token = req.headers.authorization.split(" ")[1];
          //Validate token by getting the connected user
          let user = await this.usersService.getByToken(token);
          if (user) {
            //If the token is valid, make the API call
            next();
          } else {
            //If token is invalid, throw an exception
            throw new HttpException("Invalid access token. Please try again!", HttpStatus.UNAUTHORIZED);
          }
        } else {
          //If there is no authorization token, cancel the API call and return Unautorized Error
          throw new HttpException(
            "You are not authorized to access the API. Please login and try again!",
            HttpStatus.UNAUTHORIZED
          );
        }
      } else {
        //Return not found error as the requested API is neither private nor public, hence not a valid API
        throw new HttpException("URL Not Found", HttpStatus.NOT_FOUND);
      }
    }
  }
}

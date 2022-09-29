import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:"xlotoken"
        });
    }

    async validate(payload:any){
        
        return{
            id:payload.sub,
            name:payload.username,
            expDate:payload.exp,
        };
    }
}
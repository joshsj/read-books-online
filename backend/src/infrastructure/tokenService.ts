import { ApiError } from "@/application/common/error/apiError";
import { invalidToken } from "@/application/common/error/messages";
import { IConfiguration } from "@/application/common/interfaces/configuration";
import { ITokenService, Token } from "@/application/common/interfaces/tokenService";
import { Dependency } from "@/application/dependency";
import { JWTPayload } from "@/web/common/models/auth";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

class TokenService implements ITokenService {
  create(payload: JWTPayload): Promise<Token> {
    const {
      jwt: { secret, audience, issuer, algorithm, expiresIn },
    } = container.resolve<IConfiguration>(Dependency.configuration);

    return new Promise((resolve, reject) =>
      jwt.sign(payload, secret, { expiresIn, audience, issuer, algorithm }, (_, token) =>
        token ? resolve(token) : reject(new ApiError("authentication"))
      )
    );
  }

  validate(token: string): Promise<JWTPayload> {
    const {
      jwt: { secret, audience, issuer, algorithm },
    } = container.resolve<IConfiguration>(Dependency.configuration);

    return new Promise((resolve, reject) =>
      jwt.verify(token, secret, { audience, issuer, algorithms: [algorithm] }, (_, payload) => {
        if (!JWTPayload.guard(payload)) {
          return reject(new ApiError("authentication", invalidToken));
        }

        resolve(payload);
      })
    );
  }

  payload(token: string): Promise<JWTPayload> {
    return new Promise((resolve, reject) => {
      const payload = jwt.decode(token, { json: true });

      if (!JWTPayload.guard(payload)) {
        return reject(new ApiError("authentication", invalidToken));
      }

      resolve(payload);
    });
  }
}

export { TokenService };

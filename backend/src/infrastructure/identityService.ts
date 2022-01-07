import { ApiError } from "@/application/common/error/apiError";
import { incorrectPassword, invalidToken, userNotFound } from "@/application/common/error/messages";
import { IConfiguration } from "@/application/common/interfaces/configuration";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IHttpContextService } from "@/application/common/interfaces/httpContextService";
import { AuthToken, IIdentityService } from "@/application/common/interfaces/identityService";
import { IUserRepository } from "@/application/common/interfaces/repository";
import { ensure } from "@/common/utilities";
import { Password, Username } from "@/domain/common/constrainedTypes";
import { User } from "@/domain/entities/user";
import { JWTPayload } from "@/web/common/models/auth";
import jwt from "jsonwebtoken";

class IdentityService implements IIdentityService {
  constructor(
    private readonly httpContextService: IHttpContextService,
    private readonly hashingService: IHashingService,
    private readonly configuration: IConfiguration,
    private readonly userRepository: IUserRepository
  ) {}

  async authenticate(): Promise<void> {
    const token = this.getToken();
    const { algorithm, audience, issuer, secret } = this.configuration.jwt;

    return new Promise((resolve, reject) =>
      jwt.verify(token, secret, { audience, issuer, algorithms: [algorithm] }, (err) =>
        err ? reject(new ApiError("authentication", invalidToken)) : resolve()
      )
    );
  }

  async login(username: Username, password: Password): Promise<AuthToken> {
    const user = await this.userRepository.getByUsername(username);

    ensure(!!user, new ApiError("missing", userNotFound(username)));
    ensure(
      await this.hashingService.compare(password, user.passwordHash),
      new ApiError("authentication", incorrectPassword(username))
    );

    return this.createToken({ sub: user.id });
  }

  async getCurrentUserId(): Promise<string> {
    return (await this.getPayload()).sub;
  }

  async getCurrentUser(): Promise<User> {
    const currentUser = await this.userRepository.get(await this.getCurrentUserId());

    ensure(!!currentUser, new ApiError("missing", userNotFound()));

    return currentUser;
  }

  private createToken(payload: JWTPayload): Promise<AuthToken> {
    const { algorithm, audience, expiresIn, issuer, secret } = this.configuration.jwt;

    return new Promise((resolve, reject) =>
      jwt.sign(payload, secret, { expiresIn, audience, issuer, algorithm }, (_, token) =>
        token ? resolve(token) : reject(new ApiError("authentication"))
      )
    );
  }

  private getPayload(): Promise<JWTPayload> {
    return new Promise((resolve, reject) => {
      const token = this.getToken();
      const payload = jwt.decode(token, { json: true });

      if (!JWTPayload.guard(payload)) {
        return reject(new ApiError("authentication", invalidToken));
      }

      resolve(payload);
    });
  }

  private getToken(): AuthToken {
    const { req } = this.httpContextService.getCurrent();

    const token = req.headers.authorization?.split(" ")[1];

    ensure(!!token, new ApiError("authorization", invalidToken));

    return token;
  }
}

export { IdentityService };

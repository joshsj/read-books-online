import { RBOError } from "@/application/common/error/rboError";
import {
  expiredRefreshToken,
  incorrectPassword,
  invalidAuthToken,
  invalidRefreshToken,
  noRefreshToken,
  userNotFound,
} from "@/application/common/error/messages";
import { IConfiguration } from "@/application/common/interfaces/configuration";
import { IHashingService } from "@/application/common/interfaces/hashingService";
import { IHttpContextService } from "@/application/common/interfaces/httpContextService";
import { AuthTokenValue, IIdentityService } from "@/application/common/interfaces/identityService";
import { IRefreshTokenRepository, IUserRepository } from "@/application/common/interfaces/repository";
import { ensure } from "@/common/utilities";
import { Password, Username } from "@/domain/common/constrainedTypes";
import { Id, newId } from "@/domain/common/id";
import { RefreshToken } from "@/domain/entities/refreshToken";
import { User } from "@/domain/entities/user";
import { JWTPayload } from "@/web/common/models/auth";
import jwt from "jsonwebtoken";

class IdentityService implements IIdentityService {
  constructor(
    private readonly httpContextService: IHttpContextService,
    private readonly hashingService: IHashingService,
    private readonly configuration: IConfiguration,
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async authenticate(): Promise<void> {
    const value = await this.getAuthTokenValue();
    const { algorithm, audience, issuer, secret } = this.configuration.auth.jwt;

    return new Promise((resolve, reject) =>
      jwt.verify(value, secret, { audience, issuer, algorithms: [algorithm] }, (err) =>
        err ? reject(new RBOError("authentication", invalidAuthToken)) : resolve()
      )
    );
  }

  login(refresh: "refresh"): Promise<AuthTokenValue>;
  login(username: Username, password: Password): Promise<AuthTokenValue>;
  async login(username: Username, password?: Password): Promise<AuthTokenValue> {
    return password ? this.loginFromDetails(username, password) : this.loginFromRefresh();
  }

  private async loginFromDetails(username: Username, password: Password): Promise<AuthTokenValue> {
    const user = await this.userRepository.getByUsername(username);

    ensure(!!user, new RBOError("missing", userNotFound(username)));
    ensure(
      await this.hashingService.compare(password, user.passwordHash),
      new RBOError("authentication", incorrectPassword(username))
    );

    return this.configureTokens(user);
  }

  private async loginFromRefresh(): Promise<AuthTokenValue> {
    const { req } = this.httpContextService.getCurrent();
    const { refreshTokenKey } = this.configuration.server.cookie;

    const currentRefreshTokenValue = req.signedCookies[refreshTokenKey];
    ensure(
      typeof currentRefreshTokenValue === "string" && !!currentRefreshTokenValue.length,
      new RBOError("authentication", noRefreshToken)
    );

    const currentRefreshToken = await this.refreshTokenRepository.getByValue(currentRefreshTokenValue);
    ensure(!!currentRefreshToken, new RBOError("authentication", invalidRefreshToken));
    ensure(new Date() < currentRefreshToken.expires, new RBOError("authentication", expiredRefreshToken));

    const user = await this.userRepository.get(currentRefreshToken.userId);
    if (!user) {
      await this.refreshTokenRepository.delete(currentRefreshToken.id);

      throw new RBOError(
        "fatal",
        `Invalid userId value (${currentRefreshToken.userId}) for Refresh Token (${currentRefreshToken.id})`
      );
    }

    return this.configureTokens(user);
  }

  private async configureTokens({ id: userId }: User): Promise<AuthTokenValue> {
    const { res } = this.httpContextService.getCurrent();
    const {
      mode,
      auth: {
        expiresInMs,
        jwt: { secret, audience, issuer, algorithm },
      },
      server: { cookie },
    } = this.configuration;
    const expires = new Date(Date.now() + expiresInMs);

    const existingId = (await this.refreshTokenRepository.getByUserId(userId))?.id;

    const refreshToken: RefreshToken = {
      id: existingId ?? newId(),
      value: await this.hashingService.salt(),
      userId,
      expires,
    };

    const method = existingId ? "update" : "insert";
    await this.refreshTokenRepository[method](refreshToken);

    res.cookie(cookie.refreshTokenKey, refreshToken.value, {
      httpOnly: true,
      sameSite: true,
      secure: mode !== "development",
      signed: true,
      expires,
    });

    const payload: JWTPayload = { sub: userId };

    return new Promise((resolve, reject) =>
      jwt.sign(payload, secret, { expiresIn: expiresInMs, audience, issuer, algorithm }, (_, token) =>
        token ? resolve(token) : reject(new RBOError("authentication"))
      )
    );
  }

  private async getAuthTokenValue(): Promise<AuthTokenValue> {
    const { req } = this.httpContextService.getCurrent();

    const value = req.headers.authorization?.split(" ")[1];
    ensure(!!value, new RBOError("authorization", invalidAuthToken));

    return value;
  }

  getCurrentUserId(): Promise<Id> {
    return new Promise(async (resolve, reject) => {
      const payload = jwt.decode(await this.getAuthTokenValue(), {
        json: true,
      });

      if (!JWTPayload.guard(payload)) {
        return reject(new RBOError("authentication", invalidAuthToken));
      }

      resolve(payload.sub);
    });
  }

  async getCurrentUser(): Promise<User> {
    const currentUser = await this.userRepository.get(await this.getCurrentUserId());

    ensure(!!currentUser, new RBOError("missing", userNotFound()));

    return currentUser;
  }
}

export { IdentityService };

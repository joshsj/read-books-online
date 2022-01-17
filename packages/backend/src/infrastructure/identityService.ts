import {
  expiredRefreshToken,
  incorrectPassword,
  invalidAuthToken,
  invalidRefreshToken,
  noRefreshToken,
  userNotFound,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import {
  AuthTokenValue,
  IIdentityService,
} from "@backend/application/common/interfaces/identityService";
import {
  IRefreshTokenRepository,
  IUserRepository,
} from "@backend/application/common/interfaces/repository";
import { Password, Username } from "@backend/domain/common/constrainedTypes";
import { Id, newId } from "@backend/domain/common/id";
import { RefreshToken } from "@backend/domain/entities/refreshToken";
import { User } from "@backend/domain/entities/user";
import { JWTPayload } from "@backend/web/common/models/auth";
import { ensure } from "@core/utilities";
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
    const refreshTokenValue = await this.getRefreshTokenCookie();

    ensure(
      typeof refreshTokenValue === "string" && !!refreshTokenValue.length,
      new RBOError("authentication", noRefreshToken)
    );

    const refreshToken = await this.refreshTokenRepository.getByValue(refreshTokenValue);
    ensure(!!refreshToken, new RBOError("authentication", invalidRefreshToken));
    ensure(new Date() < refreshToken.expires, new RBOError("authentication", expiredRefreshToken));

    const user = await this.userRepository.get(refreshToken.userId);
    if (!user) {
      await this.refreshTokenRepository.delete(refreshToken.id);

      throw new RBOError(
        "fatal",
        `Invalid userId value (${refreshToken.userId}) for Refresh Token (${refreshToken.id})`
      );
    }

    return this.configureTokens(user);
  }

  async logout(): Promise<void> {
    this.setRefreshTokenCookie("expired", new Date(0));

    const refreshTokenValue = await this.getRefreshTokenCookie();

    if (!(typeof refreshTokenValue === "string" && refreshTokenValue.length)) {
      return;
    }

    const refreshToken = await this.refreshTokenRepository.getByValue(refreshTokenValue);

    if (!refreshToken) {
      return;
    }

    await this.refreshTokenRepository.delete(refreshToken.id);
  }

  private async configureTokens({ id: userId }: User): Promise<AuthTokenValue> {
    const {
      auth: {
        expiresInMs,
        jwt: { secret, audience, issuer, algorithm },
      },
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
    this.setRefreshTokenCookie(refreshToken.value, expires);

    const user = (await this.userRepository.get(userId))!;

    const payload: JWTPayload = {
      sub: userId,
      preferred_username: user.username,
    };

    return new Promise((resolve, reject) =>
      jwt.sign(
        payload,
        secret,
        { expiresIn: expiresInMs, audience, issuer, algorithm },
        (_, token) => (token ? resolve(token) : reject(new RBOError("authentication")))
      )
    );
  }

  private async getAuthTokenValue(): Promise<AuthTokenValue> {
    const { req } = this.httpContextService.getCurrent();

    const value = req.headers.authorization?.split(" ")[1];
    ensure(!!value, new RBOError("authorization", invalidAuthToken));

    return value;
  }

  private async getRefreshTokenCookie(): Promise<unknown> {
    const { req } = this.httpContextService.getCurrent();
    const { refreshTokenKey } = this.configuration.server.cookie;

    return req.signedCookies[refreshTokenKey];
  }

  private setRefreshTokenCookie(value: string, expires: Date): void {
    const { res } = this.httpContextService.getCurrent();
    const { cookie } = this.configuration.server;

    res.cookie(cookie.refreshTokenKey, value, {
      httpOnly: true,
      sameSite: false, // allow CORS
      secure: true,
      signed: true,
      expires,
    });
  }

  getCurrentUserId(): Promise<Id> {
    return new Promise(async (resolve, reject) => {
      const payload = jwt.decode(await this.getAuthTokenValue(), { json: true });

      if (!JWTPayload.isValidSync(payload)) {
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

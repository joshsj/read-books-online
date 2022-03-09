import { AccountDto } from "@backend/application/common/dtos/accountDto";
import { JWTPayloadDto } from "@backend/application/common/dtos/jwtPayloadDto";
import { TokensDto } from "@backend/application/common/dtos/tokensDto";
import {
  expiredRefreshToken,
  incorrectUsernamePassword,
  invalidAuthToken,
  invalidRefreshToken,
  noRefreshToken,
  userDisabled,
  userNotFound,
} from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IConfiguration } from "@backend/application/common/interfaces/configuration";
import { IHashingService } from "@backend/application/common/interfaces/hashingService";
import { IHttpContextService } from "@backend/application/common/interfaces/httpContextService";
import { IIdentityService } from "@backend/application/common/interfaces/identityService";
import {
  IRefreshTokenRepository,
  IUserRepository,
} from "@backend/application/common/interfaces/repository";
import { Id, newId } from "@backend/domain/common/id";
import { RefreshToken } from "@backend/domain/entities/refreshToken";
import { User } from "@backend/domain/entities/user";
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
    const { authenticationTokenValue } = this.httpContextService.getCurrent();
    ensure(!!authenticationTokenValue, new RBOError("authentication", invalidAuthToken));

    const { algorithm, audience, issuer, secret } = this.configuration.auth.jwt;

    return new Promise((resolve, reject) =>
      jwt.verify(
        authenticationTokenValue,
        secret,
        { audience, issuer, algorithms: [algorithm] },
        (err) => (err ? reject(new RBOError("authentication", invalidAuthToken)) : resolve())
      )
    );
  }

  login(refresh: "refresh"): Promise<TokensDto>;
  login(account: AccountDto): Promise<TokensDto>;
  async login(accountOrRefresh: AccountDto | "refresh"): Promise<TokensDto> {
    return typeof accountOrRefresh === "object"
      ? this.loginFromDetails(accountOrRefresh)
      : this.loginFromRefresh();
  }

  private async loginFromDetails({ username, password }: AccountDto): Promise<TokensDto> {
    const user = await this.userRepository.getByUsername(username);

    ensure(!!user, new RBOError("missing", incorrectUsernamePassword(username)));
    ensure(
      await this.hashingService.compare(password, user.passwordHash),
      new RBOError("authentication", incorrectUsernamePassword(username))
    );

    ensure(!user.disabled, new RBOError("authentication", userDisabled("login to")));

    return this.configureTokens(user);
  }

  private async loginFromRefresh(): Promise<TokensDto> {
    const { refreshTokenValue } = this.httpContextService.getCurrent();
    ensure(!!refreshTokenValue, new RBOError("authentication", noRefreshToken));

    const refreshToken = await this.refreshTokenRepository.getByValue(refreshTokenValue);

    ensure(!!refreshToken, new RBOError("authentication", invalidRefreshToken));
    ensure(new Date() < refreshToken.expires, new RBOError("authentication", expiredRefreshToken));

    return this.configureTokens(refreshToken.user);
  }

  async logout(): Promise<void> {
    const { refreshTokenValue } = this.httpContextService.getCurrent();

    if (!refreshTokenValue) {
      return;
    }

    const refreshToken = await this.refreshTokenRepository.getByValue(refreshTokenValue);

    if (!refreshToken) {
      return;
    }

    await this.refreshTokenRepository.delete(refreshToken._id);
  }

  private async configureTokens(user: User): Promise<TokensDto> {
    const {
      auth: {
        expiresInMs,
        jwt: { secret, audience, issuer, algorithm },
      },
    } = this.configuration;
    const expires = new Date(Date.now() + expiresInMs);

    const existingId = (await this.refreshTokenRepository.getByUserId(user._id))?._id;

    const refreshToken: RefreshToken = {
      _id: existingId ?? newId(),
      value: await this.hashingService.salt(),
      expires,
      user,
    };

    const method = existingId ? "update" : "insert";
    await this.refreshTokenRepository[method](refreshToken);

    const payload: JWTPayloadDto = {
      sub: user._id,
      preferred_username: user.username,
      roles: user.roles,
    };

    return new Promise((resolve, reject) =>
      jwt.sign(
        payload,
        secret,
        { expiresIn: expiresInMs, audience, issuer, algorithm },
        (_, authenticationTokenValue) =>
          authenticationTokenValue
            ? resolve({
                authentication: { value: authenticationTokenValue },
                refresh: {
                  value: refreshToken.value,
                  expires: refreshToken.expires,
                },
              })
            : reject(new RBOError("authentication"))
      )
    );
  }

  getCurrentUserId(): Promise<Id> {
    return new Promise(async (resolve, reject) => {
      const { authenticationTokenValue } = this.httpContextService.getCurrent();
      ensure(!!authenticationTokenValue, new RBOError("authentication", invalidAuthToken));

      const payload = jwt.decode(authenticationTokenValue, { json: true });

      if (!JWTPayloadDto.isValidSync(payload)) {
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

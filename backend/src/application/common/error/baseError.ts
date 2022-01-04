type BaseErrorName = `${string}Error`;

abstract class BaseError<TName extends BaseErrorName> extends Error {
  public abstract readonly name: TName;
}

export { BaseErrorName, BaseError };

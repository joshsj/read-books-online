class EntityValidationError extends Error {
  public readonly isEntityValidationError = true;

  constructor(public readonly fields: ReadonlyArray<string>) {
    super(
      fields.length
        ? `Failed to validate fields: ${fields.join(", ")}`
        : undefined
    );
  }
}

export { EntityValidationError };

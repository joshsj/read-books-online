type Guard = (condition: boolean, error?: string | Error) => asserts condition;

const guard: Guard = (
  condition: boolean,
  error?: string | Error
): asserts condition => {
  if (condition) {
    throw typeof error === "string" ? new Error(error) : error;
  }
};

export { guard, Guard };

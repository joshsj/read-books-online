type Ensure = (condition: boolean, error: Error | undefined) => asserts condition;

const ensure: Ensure = (condition: boolean, error: Error | undefined): asserts condition => {
  if (!condition) {
    throw error ?? new Error();
  }
};

export { ensure, Ensure };

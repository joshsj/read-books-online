import { RBOErrorDto } from "@client/types";
import { useNotifier } from "./notifier";

const useErrorHandler = () => {
  const { notify } = useNotifier();

  const handleError = (error: RBOErrorDto | undefined): void =>
    error && notify(error.message, "danger");

  return { handleError };
};

export { useErrorHandler };

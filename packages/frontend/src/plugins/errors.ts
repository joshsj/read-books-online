import { RBOErrorDto } from "@client/types";
import { useNotifier } from "./notifier";

const useErrors = () => {
  const { notify } = useNotifier();

  const handleError = (error: RBOErrorDto | undefined): void =>
    error && notify(error.message, "danger");

  return { handleError };
};

export { useErrors };

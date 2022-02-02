import { RBOErrorDto } from "@client/types";
import { isRBOError } from "@frontend/client";
import { Interactor } from "../interactor";
import { useTicketBusiness } from "./ticket";
import { useUserBusiness } from "./user";

const useBusiness = () => {
  const userBusiness = useUserBusiness();
  const ticketBusiness = useTicketBusiness();

  return { userBusiness, ticketBusiness };
};

const simpleAction = async (
  { notify, confirm }: Interactor,
  request: () => Promise<RBOErrorDto | void>,
  successMessage: string,
  confirmMessage?: string
): Promise<boolean> => {
  if (confirmMessage) {
    const confirmation = await confirm(confirmMessage);

    if (!confirmation) {
      return false;
    }
  }

  const response = await request();

  if (isRBOError(response)) {
    notify(response);
    return false;
  }

  notify({ message: successMessage, variant: "success" });
  return true;
};

export { useBusiness, simpleAction };

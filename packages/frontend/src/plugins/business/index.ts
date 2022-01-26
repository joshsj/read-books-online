import { useTicketBusiness } from "./ticket";
import { useUserBusiness } from "./user";

const useBusiness = () => {
  const userBusiness = useUserBusiness();
  const ticketBusiness = useTicketBusiness();

  return { userBusiness, ticketBusiness };
};

export { useBusiness };

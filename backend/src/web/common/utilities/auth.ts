import { ensure } from "@/common/utilities";
import { Request, Response } from "express";

const authenticationKey = "authenticated";

const setAuthenticated = (res: Response) => (res.locals[authenticationKey] = true);
const isAuthenticated = (res: Response) => res.locals[authenticationKey] === true;

const getToken = (req: Request) => {
  const token = req.headers.authorization?.split(" ")[1];
  ensure(!!token);
  return token;
};

export { getToken, setAuthenticated, isAuthenticated };

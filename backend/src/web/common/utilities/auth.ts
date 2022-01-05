import { Request, Response } from "express";

const authenticationKey = "authenticated";

const setAuthenticated = (res: Response) => (res.locals[authenticationKey] = true);
const isAuthenticated = (res: Response) => res.locals[authenticationKey] === true;

const getToken = (req: Request) => req.headers.authorization?.split(" ")[1];

export { getToken, setAuthenticated, isAuthenticated };

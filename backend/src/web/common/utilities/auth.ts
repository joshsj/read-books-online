import { IConfiguration } from "@/application/common/interfaces/configuration";
import { JWTPayload } from "@/web/common/models/auth";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticationKey = "authenticated";

const setAuthenticated = (res: Response) => (res.locals[authenticationKey] = true);
const isAuthenticated = (res: Response) => res.locals[authenticationKey] === true;

const getToken = (req: Request) => req.headers.authorization?.split(" ")[1];

const verifyToken = (
  token: string,
  { jwt: { secret, issuer, audience, algorithm } }: IConfiguration
): Promise<object | false> =>
  new Promise((resolve) => {
    jwt.verify(token, secret, { audience, issuer, algorithms: [algorithm] }, (_, payload) =>
      resolve(payload ? payload : false)
    );
  });

const signToken = (
  payload: JWTPayload,
  { jwt: { secret, algorithm, expiresIn, audience, issuer } }: IConfiguration
): Promise<string | false> =>
  new Promise((resolve) => {
    jwt.sign(payload, secret, { expiresIn, audience, issuer, algorithm }, (_, token) => resolve(token ? token : false));
  });

export { getToken, setAuthenticated, isAuthenticated, verifyToken, signToken };

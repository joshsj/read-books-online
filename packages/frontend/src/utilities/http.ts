type CookieOptions = {
  key: string;
  value: string;
  expires: Date;
};

const setCookie = ({ key, value, expires }: CookieOptions): void => {
  const parameters: Array<[string, string | undefined]> = [
    [key, value],
    ["name", key],
    ["expires", expires.toUTCString()],
    ["SameSite", "strict"],
    ["Secure", undefined],
  ];

  document.cookie = parameters.map((p) => p[0] + (p[1] ? `=${p[1]}` : "")).join("; ");
};

const getCookie = (key: string) =>
  document.cookie
    .split(";")
    .find((s) => s.startsWith(key))
    ?.split("=")[1];

export { CookieOptions, setCookie, getCookie };

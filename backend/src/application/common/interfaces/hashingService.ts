type IHashingService = {
  salt(): Promise<string>;
  hash(plain: string, salt: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
};

export { IHashingService };

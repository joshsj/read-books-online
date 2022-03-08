import { QueryResult } from "../interfaces/repository";

type QueryDto<T> = QueryResult<T>;

const QueryDto = {
  fromQueryResult: <T>({ items, total }: QueryResult<T>) => ({ items, total }),
};

export { QueryDto };

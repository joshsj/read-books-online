import { FilterQuery } from "mongoose";

class FilterBuilder<T> {
  private filter: FilterQuery<T> = {};

  add(filter: FilterQuery<T>) {
    Object.assign(this.filter, filter);
  }

  getFilter() {
    return this.filter;
  }
}

export { FilterBuilder };

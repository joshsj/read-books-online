import { FilterQuery } from "mongoose";

class FilterBuilder<T> {
  private filter: FilterQuery<T> = {};

  add(as: "string", field: keyof T, value: string): void;
  add(filter: FilterQuery<T>): void;
  add(filter: FilterQuery<T> | "string", field?: keyof T, value?: string): void {
    if (filter === "string") {
      Object.assign(this.filter, {
        [field!]: { $regex: new RegExp(value!), $options: "i" },
      });
      return;
    }

    Object.assign(this.filter, filter);
  }

  getFilter() {
    return this.filter;
  }
}

export { FilterBuilder };

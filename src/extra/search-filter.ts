import { SelectQueryBuilder } from "typeorm";

export default class SearchFilter<T> {
  private readonly queryBuilder: SelectQueryBuilder<T>;
  private readonly queryParams: any;

  constructor(queryBuilder: SelectQueryBuilder<T>, queryParams: any) {
    this.queryBuilder = queryBuilder;
    this.queryParams = queryParams;
  }

  filter(): this {
    const queryObj = { ...this.queryParams };
    const excludedFields = ["page", "sort", "limit", "fields", "searchField", "q"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Applying direct filtering
    Object.keys(queryObj).forEach((key) => {
      if (["gt", "gte", "lt", "lte"].some((op) => key.includes(op))) {
        const [field, operator] = key.split("_");
        const sqlOperator = { gt: ">", gte: ">=", lt: "<", lte: "<=" }[operator];
        this.queryBuilder.andWhere(`${field} ${sqlOperator} :value`, {
          value: queryObj[key],
        });
      } else {
        this.queryBuilder.andWhere(`${key} = :value`, { value: queryObj[key] });
      }
    });

    // Search via text
    if (this.queryParams.searchField && this.queryParams.q) {
      const searchField = this.queryParams.searchField;
      const searchTerm = `%${this.queryParams.q}%`;
      this.queryBuilder.andWhere(`${searchField} ILIKE :searchTerm`, { searchTerm });
    }

    return this;
  }

  sort(): this {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort
        .split(",")
        .map((field: string) => `${field} ASC`)
        .join(", ");
      this.queryBuilder.orderBy(sortBy);
    } else {
      this.queryBuilder.orderBy("createdAt", "DESC");
    }
    return this;
  }

  fields(): this {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields
        .split(",")
        .map((field: string) => `tour.${field}`);
      this.queryBuilder.select(fields);
    }
    return this;
  }

  paginate(): this {
    const page = Math.max(Number(this.queryParams.page) || 1, 1);
    const maxLimit = 1000;
    const limit = Math.min(Math.max(Number(this.queryParams.limit) || 100, 1), maxLimit);
    const skip = (page - 1) * limit;

    this.queryBuilder.skip(skip).take(limit);
    return this;
  }

  getQuery(): SelectQueryBuilder<T> {
    return this.queryBuilder;
  }
}

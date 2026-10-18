export const COUNTRY_PAGE_SIZE = 8;

export function countryPage<T>(
  countries: readonly T[],
  requestedPage: number,
  pageSize: 4 | 8 = COUNTRY_PAGE_SIZE,
) {
  const pageCount = Math.max(1, Math.ceil(countries.length / pageSize));
  const page = Number.isInteger(requestedPage)
    ? Math.min(pageCount, Math.max(1, requestedPage))
    : 1;
  const offset = (page - 1) * pageSize;
  return {
    page,
    pageCount,
    countries: countries.slice(offset, offset + pageSize),
    first: countries.length ? offset + 1 : 0,
    last: Math.min(offset + pageSize, countries.length),
  };
}

export const COUNTRY_PAGE_SIZE = 8;

export function countryPage<T>(countries: readonly T[], requestedPage: number) {
  const pageCount = Math.max(
    1,
    Math.ceil(countries.length / COUNTRY_PAGE_SIZE),
  );
  const page = Number.isInteger(requestedPage)
    ? Math.min(pageCount, Math.max(1, requestedPage))
    : 1;
  const offset = (page - 1) * COUNTRY_PAGE_SIZE;
  return {
    page,
    pageCount,
    countries: countries.slice(offset, offset + COUNTRY_PAGE_SIZE),
    first: countries.length ? offset + 1 : 0,
    last: Math.min(offset + COUNTRY_PAGE_SIZE, countries.length),
  };
}

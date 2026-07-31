export const DEFAULT_PAGE_SIZE = 10;

export interface RawListSearchParams {
  q?: string;
  sort?: string;
  dir?: string;
  page?: string;
}

export interface ParsedListQuery {
  q: string;
  sort: string;
  dir: "asc" | "desc";
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

/** Turns a page's `searchParams` into typed, safe pagination/sort/search state. */
export function parseListQuery(
  searchParams: RawListSearchParams,
  defaultSort: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): ParsedListQuery {
  const page = Math.max(1, Math.trunc(Number(searchParams.page)) || 1);
  const dir: "asc" | "desc" = searchParams.dir === "asc" ? "asc" : "desc";

  return {
    q: searchParams.q?.trim() ?? "",
    sort: searchParams.sort || defaultSort,
    dir,
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Builds a page href that preserves the current q/sort/dir, with overrides applied. */
export function buildListHref(
  basePath: string,
  current: Pick<ParsedListQuery, "q" | "sort" | "dir" | "page">,
  overrides: Partial<Pick<ParsedListQuery, "q" | "sort" | "dir" | "page">>
): string {
  const next = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.sort) params.set("sort", next.sort);
  if (next.dir) params.set("dir", next.dir);
  if (next.page && next.page > 1) params.set("page", String(next.page));

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

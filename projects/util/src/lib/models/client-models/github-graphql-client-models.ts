export interface GetRepoForUserPayload {
  userName: string;
  first: number;
  after?: string;
  orderBy?: SortModel;
}

export interface SearchInRepoPayload extends GetRepoForUserPayload {
  searchString: string;
}

export interface DataSummary<T> {
  pageInfo: PageInfo;
  totalCount: number;
  data: T[];
}

export interface RepositoryResponse {
  id: string;
  name: string;
  url: string;
  stargazerCount: number;
  primaryLanguage: string;
  description: string;
  createdAt: string;
  forkCount: number;
  updatedAt: string;
}

export enum LoadingState {
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
}

export interface GraphModel {
  x: string;
  y: number;
}

export interface SortModel {
  colId: string;
  sort: string;
}

interface PageInfo {
  endCursor: string;
  startCursor: string;
  hasNextPage: boolean;
}

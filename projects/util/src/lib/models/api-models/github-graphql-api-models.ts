export interface EndPointRequestParams {
  userName: string;
  first: number;
  after: string | null;
  orderBy: { field: string; direction: string } | null;
}

export interface EndPointSearchParams extends EndPointRequestParams {
  searchString: string;
}

export interface EndPointResponse<T> {
  data: T;
}

export interface User {
  user: { repositories: Repositories };
}

export interface Search {
  search: { repositoryCount: number; edges: Edge[] };
}

interface Edge {
  node: Node;
}

//non-exported interface
interface Repositories {
  totalCount: number;
  pageInfo: PageInfo;
  nodes: Node[];
}

interface PageInfo {
  endCursor: string;
  startCursor: string;
  hasNextPage: boolean;
}

export interface Node {
  id: string;
  name: string;
  url: string;
  stargazerCount: number;
  primaryLanguage?: { name: string };
  description: string;
  createdAt: string;
  forkCount: number;
  updatedAt: string;
}

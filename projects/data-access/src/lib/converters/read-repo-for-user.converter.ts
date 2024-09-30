import {
  DataSummary,
  EndPointRequestParams,
  EndPointResponse,
  EndPointSearchParams,
  getRepoForUserPayload,
  RepositoryResponse,
  Search,
  SearchInRepoPayload,
  User,
} from '@github-graphql-assignment/util';

export function convertParamsForAPIRequest(
  getRepoForUserPayload: getRepoForUserPayload,
): EndPointRequestParams {
  return {
    userName: getRepoForUserPayload.userName,
    first: getRepoForUserPayload.first,
    after: getRepoForUserPayload.after ? getRepoForUserPayload.after : null,
    orderBy: getRepoForUserPayload.orderBy
      ? {
          field: getRepoForUserPayload.orderBy.colId,
          direction: getRepoForUserPayload.orderBy.sort,
        }
      : null,
  };
}

export function convertAPIResponseToClientModel(
  response: EndPointResponse<User>,
): DataSummary<RepositoryResponse> {
  return {
    totalCount: response.data.user.repositories.totalCount,
    pageInfo: {
      endCursor: response.data.user.repositories.pageInfo.endCursor,
      startCursor: response.data.user.repositories.pageInfo.startCursor,
      hasNextPage: response.data.user.repositories.pageInfo.hasNextPage,
    },
    data: response.data.user.repositories.nodes.map((node) => {
      return {
        id: node.id,
        name: node.name,
        url: node.url,
        stargazerCount: node.stargazerCount,
        primaryLanguage: node.primaryLanguage?.name || '',
        description: node.description,
        createdAt: node.createdAt,
        forkCount: node.forkCount,
        updatedAt: node.updatedAt,
      };
    }),
  };
}

//search
export function convertSearchParamsForAPIRequest(
  searchInRepoPayload: SearchInRepoPayload,
): EndPointSearchParams {
  return {
    userName: searchInRepoPayload.userName,
    first: searchInRepoPayload.first,
    after: searchInRepoPayload.after ? searchInRepoPayload.after : null,
    orderBy: searchInRepoPayload.orderBy
      ? {
          field: searchInRepoPayload.orderBy.colId,
          direction: searchInRepoPayload.orderBy.sort,
        }
      : null,
    searchString: searchInRepoPayload.searchString,
  };
}

export function convertSearchAPIResponseToClientModel(
  response: EndPointResponse<Search>,
): DataSummary<RepositoryResponse> {
  return {
    totalCount: response.data.search.repositoryCount,
    pageInfo: {
      // response.data.search.pageInfo.hasNextPage response has no pageInfo
      endCursor: '',
      startCursor: '',
      hasNextPage: false,
    },
    data: response.data.search.edges.map((edge) => {
      return {
        id: edge.node.id,
        name: edge.node.name,
        url: edge.node.url,
        stargazerCount: edge.node.stargazerCount,
        primaryLanguage: edge.node.primaryLanguage?.name || '',
        description: edge.node.description,
        createdAt: edge.node.createdAt,
        forkCount: edge.node.forkCount,
        updatedAt: edge.node.updatedAt,
      };
    }),
  };
}

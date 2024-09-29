import {
  DataSummary,
  EndPointRequestParams,
  EndPointResponse,
  GetRepoForUserPayload,
  RepositoryResponse,
  User,
} from '@github-graphql-assignment/util';

export function convertParamsForAPIRequest(
  getRepoForUserPayload: GetRepoForUserPayload,
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

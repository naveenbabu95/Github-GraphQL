import {
  API_RESPONSE_USER_REPO_MOCK,
  DATA_SUMMARY_MOCK,
  ENDPOINT_RESPONSE_USER_MOCK,
  GET_REPOS_FOR_USER_PAYLOAD_MOCK,
} from '@github-graphql-assignment/util';
import {
  convertAPIResponseToClientModel,
  convertParamsForAPIRequest,
} from './read-repo-for-user.converter';

describe('ReadRepoForUserConverter', () => {
  it('converts getRepoForUserPayload into  EndPointRequestParams', () => {
    const result = convertParamsForAPIRequest(GET_REPOS_FOR_USER_PAYLOAD_MOCK);

    expect(result).toEqual(ENDPOINT_RESPONSE_USER_MOCK);
  });

  it('converts getRepoForUserPayload into  EndPointRequestParams when orderBy and next page is empty', () => {
    const result = convertParamsForAPIRequest({
      ...GET_REPOS_FOR_USER_PAYLOAD_MOCK,
      after: undefined,
      orderBy: undefined,
    });

    expect(result).toEqual({
      ...ENDPOINT_RESPONSE_USER_MOCK,
      orderBy: null,
      after: null,
    });
  });

  it('converts EndPointResponse<User> into DataSummary<RepositoryResponse>', () => {
    const result = convertAPIResponseToClientModel(API_RESPONSE_USER_REPO_MOCK);

    expect(result).toEqual(DATA_SUMMARY_MOCK);
  });

  it('converts EndPointResponse<User> into DataSummary<RepositoryResponse> where primary language is null', () => {
    const result = convertAPIResponseToClientModel({
      ...API_RESPONSE_USER_REPO_MOCK,
      data: {
        ...API_RESPONSE_USER_REPO_MOCK.data,
        user: {
          ...API_RESPONSE_USER_REPO_MOCK.data.user,
          repositories: {
            ...API_RESPONSE_USER_REPO_MOCK.data.user.repositories,
            nodes: [
              {
                id: 'test',
                name: 'test',
                url: 'test',
                stargazerCount: 1,
                primaryLanguage: undefined,
                description: 'test',
                createdAt: 'test',
                forkCount: 1,
                updatedAt: 'test',
              },
            ],
          },
        },
      },
    });

    expect(result).toEqual({
      ...DATA_SUMMARY_MOCK,
      data: [
        {
          id: 'test',
          name: 'test',
          url: 'test',
          stargazerCount: 1,
          primaryLanguage: '',
          description: 'test',
          createdAt: 'test',
          forkCount: 1,
          updatedAt: 'test',
        },
      ],
    });
  });
});

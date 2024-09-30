import {
  EndPointRequestParams,
  EndPointResponse,
  User,
} from '../models/api-models/github-graphql-api-models';
import {
  getRepoForUserPayload,
  RepositoryResponse,
} from '../models/client-models/github-graphql-client-models';

export const GET_REPOS_FOR_USER_PAYLOAD_MOCK: getRepoForUserPayload = {
  userName: 'test',
  first: 10,
  after: 'Y3Vyc29yOnYyOpHOGEiqIw==',
  orderBy: {
    colId: 'NAME',
    sort: 'ASC',
  },
};

export const ENDPOINT_RESPONSE_USER_MOCK: EndPointRequestParams = {
  userName: 'test',
  first: 10,
  after: 'Y3Vyc29yOnYyOpHOGEiqIw==',
  orderBy: {
    field: 'NAME',
    direction: 'ASC',
  },
};

export const API_RESPONSE_USER_REPO_MOCK: EndPointResponse<User> = {
  data: {
    user: {
      repositories: {
        totalCount: 100,
        pageInfo: {
          endCursor: 'Y3Vyc29yOnYyOpHOGEiqIw==',
          startCursor: 'Y3Vyc29yOnYyOpHOGEjNTw==',
          hasNextPage: true,
        },
        nodes: [
          {
            id: 'test',
            name: 'test',
            url: 'test',
            stargazerCount: 1,
            primaryLanguage: {
              name: 'test',
            },
            description: 'test',
            createdAt: 'test',
            forkCount: 1,
            updatedAt: 'test',
          },
        ],
      },
    },
  },
};

export const DATA_SUMMARY_MOCK = {
  totalCount: 100,
  pageInfo: {
    endCursor: 'Y3Vyc29yOnYyOpHOGEiqIw==',
    startCursor: 'Y3Vyc29yOnYyOpHOGEjNTw==',
    hasNextPage: true,
  },
  data: [
    {
      id: 'test',
      name: 'test',
      url: 'test',
      stargazerCount: 1,
      primaryLanguage: 'test',
      description: 'test',
      createdAt: 'test',
      forkCount: 1,
      updatedAt: 'test',
    },
  ],
};

export const MOCK_REPOS: RepositoryResponse[] = [
  {
    id: '1',
    name: 'repo1',
    stargazerCount: 10,
    forkCount: 5,
    url: 'testurl1',
    primaryLanguage: 'testLang1',
    description: 'testDesc1',
    createdAt: 'testDate1',
    updatedAt: 'testDate1',
  },
  {
    id: '2',
    name: 'repo2',
    stargazerCount: 20,
    forkCount: 3,
    url: 'testurl2',
    primaryLanguage: 'testLang2',
    description: 'testDesc2',
    createdAt: 'testDate2',
    updatedAt: 'testDate2',
  },
];

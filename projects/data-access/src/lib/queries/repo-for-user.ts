import { gql } from '@apollo/client/core';

export const GET_REPOSITORIES = gql`
  query GetRepositories(
    $userName: String!
    $first: Int = 10
    $after: String
    $orderBy: RepositoryOrder
  ) {
    user(login: $userName) {
      repositories(first: $first, after: $after, orderBy: $orderBy) {
        totalCount
        pageInfo {
          endCursor
          startCursor
          hasNextPage
        }
        nodes {
          id
          name
          url
          primaryLanguage {
            name
          }
          description
          createdAt
          forkCount
          hasIssuesEnabled
          isPrivate
          updatedAt
          stargazerCount
        }
      }
    }
  }
`;

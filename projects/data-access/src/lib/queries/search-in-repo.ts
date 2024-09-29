import { gql } from '@apollo/client/core';

export const SEARCH_REPOSITORIES = gql`
  query SearchInRepositories(
    $userName: String!
    $searchString: String!
    $first: Int = 10
    $after: String
    $orderBy: RepositoryOrder
  ) {
    search(query: "user:$userName $searchString", type: REPOSITORY, first: $first, after: $after orderBy: $orderBy) {

        repositoryCount
        edges {
          node {
            ... on Repository {
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
    }
  }
`;

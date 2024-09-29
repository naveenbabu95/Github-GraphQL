import { Apollo } from 'apollo-angular';
import { ReadRepoService } from './read-repo-service';
import { createSpyFromClass } from 'jest-auto-spies';
import {
  API_RESPONSE_USER_REPO_MOCK,
  ENDPOINT_RESPONSE_USER_MOCK,
  GET_REPOS_FOR_USER_PAYLOAD_MOCK,
} from '@github-graphql-assignment/util';
import { ApolloQueryResult } from '@apollo/client';
import { GET_REPOSITORIES } from '../../queries/repo-for-user';
import { of } from 'rxjs';

describe('ReadRepoService', () => {
  function setup() {
    const apolloService = createSpyFromClass(Apollo);

    apolloService.query.mockReturnValue(
      of(API_RESPONSE_USER_REPO_MOCK as ApolloQueryResult<unknown>),
    );
    const service = new ReadRepoService(apolloService);

    return { service, apolloService };
  }

  it('should call apollo query with correct params', () => {
    const { service, apolloService } = setup();

    service.getRepoForUser(GET_REPOS_FOR_USER_PAYLOAD_MOCK);

    expect(apolloService.query).toHaveBeenCalledWith({
      query: GET_REPOSITORIES,
      variables: ENDPOINT_RESPONSE_USER_MOCK,
    });

    service
      .getRepoForUser(GET_REPOS_FOR_USER_PAYLOAD_MOCK)
      .subscribe((response) => {
        expect(response).toBe(API_RESPONSE_USER_REPO_MOCK);
      });
  });
});

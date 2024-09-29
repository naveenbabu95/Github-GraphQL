import { Injectable } from '@angular/core';
import {
  DataSummary,
  EndPointResponse,
  GetRepoForUserPayload,
  RepositoryResponse,
  User,
} from '@github-graphql-assignment/util';
import { Apollo } from 'apollo-angular';
import { GET_REPOSITORIES } from '../../queries/repo-for-user';
import { map, Observable } from 'rxjs';
import {
  convertAPIResponseToClientModel,
  convertParamsForAPIRequest,
} from '../../converters/read-repo-for-user.converter';

@Injectable()
export class ReadRepoService {
  constructor(private apollo: Apollo) {}

  getRepoForUser(
    getRepoForUserPayload: GetRepoForUserPayload,
  ): Observable<DataSummary<RepositoryResponse>> {
    return this.apollo
      .query({
        query: GET_REPOSITORIES,
        variables: convertParamsForAPIRequest(getRepoForUserPayload),
      })
      .pipe(
        map((response) =>
          convertAPIResponseToClientModel(response as EndPointResponse<User>),
        ),
      );
  }
}

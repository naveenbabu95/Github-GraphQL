import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadRepoService } from '@github-graphql-assignment/data-access';
import {
  getRepoForUserPayload,
  GraphModel,
  LoadingState,
  RECORDS_TO_BE_SHOWN_FOR_GRAPH,
  RepositoryResponse,
} from '@github-graphql-assignment/util';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { filter, map, switchMap, tap } from 'rxjs';

interface GraphViewState {
  userRepos?: RepositoryResponse[];
  totalRecords?: number;
  loadingState: LoadingState;
}

const INITIAL_STATE: GraphViewState = {
  loadingState: LoadingState.LOADED,
};

export interface GraphViewVm {
  graphModel: GraphModel[];
  showError: boolean;
  isLoading: boolean;
}

@Injectable()
export class GraphViewStore
  extends ComponentStore<GraphViewState>
  implements OnStateInit
{
  constructor(
    private readRepoService: ReadRepoService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
  ) {
    super(INITIAL_STATE);
  }

  readonly userName$ = this.route.paramMap.pipe(
    map((params) => {
      return params.get('userName');
    }),
  );

  private readonly loadingState$ = this.select((state) => state.loadingState);
  private readonly userRepos$ = this.select((state) => state.userRepos);

  readonly vm$ = this.select(
    this.userRepos$,
    this.loadingState$,
    (userRepos, loadingState): GraphViewVm => {
      return {
        graphModel:
          userRepos?.map((repo) => {
            return {
              x: repo.name,
              y: repo.stargazerCount,
            };
          }) ?? [],
        showError: loadingState === LoadingState.ERROR,
        isLoading: loadingState === LoadingState.LOADING,
      };
    },
    // { debounce: true },
  );
  ngrxOnStateInit(): void {
    this.fetchReposForSpecificUser();
  }

  readonly fetchReposForSpecificUser = this.effect((trigger$) => {
    return trigger$.pipe(
      concatLatestFrom(() => [this.userName$]),
      tap(() =>
        this.patchState({
          loadingState: LoadingState.LOADING,
        }),
      ),
      filter(([, userName]) => !!userName),
      switchMap(([, userName]) => {
        const getRepoForUserPayload: getRepoForUserPayload = {
          userName: userName as string,
          first: RECORDS_TO_BE_SHOWN_FOR_GRAPH,
        };
        return this.readRepoService.getRepoForUser(getRepoForUserPayload).pipe(
          tapResponse(
            (response) => {
              this.patchState({
                userRepos: response.data,
                totalRecords: response.totalCount,
                loadingState: LoadingState.LOADED,
              });
            },
            (err: unknown) => {
              console.log(err); //TODO: add logging mechanism
              this.patchState({
                loadingState: LoadingState.ERROR,
              });
            },
          ),
        );
      }),
    );
  });
}

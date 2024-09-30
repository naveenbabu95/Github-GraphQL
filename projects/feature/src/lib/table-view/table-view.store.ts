import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadRepoService } from '@github-graphql-assignment/data-access';
import {
  COLUMN_DEFINITION_FOR_REPO_TABLE,
  getRepoForUserPayload,
  LoadingState,
  RepositoryResponse,
  SearchInRepoPayload,
  SortModel,
  TABLE_FETCH_LIMIT,
} from '@github-graphql-assignment/util';
import { ColDef } from 'ag-grid-community';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import {
  combineLatestWith,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { tapResponse } from '@ngrx/operators';

interface TableViewState {
  userRepos?: RepositoryResponse[];
  totalRecords?: number;
  sortOrder?: SortModel;
  afterCursor?: string;
  hasNextPage?: boolean;
  searchQuery: string;
  loadingState: LoadingState;
  pageNo: number;
}

const INITIAL_STATE: TableViewState = {
  loadingState: LoadingState.LOADED,
  searchQuery: '',
  pageNo: 0,
  hasNextPage: true,
};

export interface TableViewVm {
  userRepos: RepositoryResponse[];
  columnDefs: ColDef[];
  totalRecords: number;
  showError: boolean;
  isLoading: boolean;
}

@Injectable()
export class TableViewStore extends ComponentStore<TableViewState> {
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
  private readonly afterCursor$ = this.select((state) => state.afterCursor);
  private readonly totalRecords$ = this.select((state) => state.totalRecords);
  private readonly hasNextPage$ = this.select((state) => state.hasNextPage);
  private readonly sortOrder$ = this.select((state) => state.sortOrder);
  private readonly searchQuery$ = this.select((state) => state.searchQuery);
  private readonly pageNo$ = this.select((state) => state.pageNo).pipe(
    filter((pageNo) => pageNo > 0),
  );

  readonly vm$ = this.select(
    this.userRepos$,
    this.totalRecords$,
    this.loadingState$,
    (userRepos, totalRecords, loadingState): TableViewVm => {
      return {
        userRepos: userRepos || [],
        totalRecords: Number(totalRecords),
        columnDefs: COLUMN_DEFINITION_FOR_REPO_TABLE,
        showError: loadingState === LoadingState.ERROR,
        isLoading: loadingState === LoadingState.LOADING,
      };
    },
  );

  updateUserRepos(userRepos: RepositoryResponse[]) {
    this.setState((state) => ({
      ...state,
      userRepos,
    }));
  }

  readonly incrementPageNo = this.updater(
    (state): TableViewState => ({
      ...state,
      pageNo: state.pageNo + 1,
    }),
  );
  readonly updateSearch = this.updater(
    (state, searchQuery: string): TableViewState => ({
      ...state,
      searchQuery,
    }),
  );

  readonly updateSort = this.updater(
    (state, sortParam: SortModel): TableViewState => ({
      ...state,
      afterCursor: '',
      hasNextPage: true,
      sortOrder: sortParam,
    }),
  );

  init(): void {
    this.fetchReposForSpecificUser();
    this.searchQueryForSpecificUser();
  }

  readonly searchQueryForSpecificUser = this.effect((trigger$) => {
    return trigger$.pipe(
      combineLatestWith(this.sortOrder$, this.searchQuery$, this.pageNo$),
      withLatestFrom(
        this.userName$,
        this.afterCursor$,
        this.hasNextPage$,
        this.userRepos$,
        this.state$,
      ),
      filter(
        ([[, , searchQuery], userName, , hasNextPage]) =>
          !!userName && !!hasNextPage && !!searchQuery,
      ),
      tap(() => this.patchState({ loadingState: LoadingState.LOADING })),
      switchMap(([[, sortOrder, searchQuery], userName, afterCursor]) => {
        const searchPayload: SearchInRepoPayload = {
          userName: userName as string,
          first: TABLE_FETCH_LIMIT,
          after: afterCursor,
          orderBy: sortOrder?.colId ? sortOrder : undefined,
          searchString: searchQuery,
        };
        return this.readRepoService.searchInRepo(searchPayload).pipe(
          tap(() =>
            this.patchState({
              userRepos: [],
            }),
          ),
          tapResponse(
            (response) => {
              this.updateUserRepos(response.data);
              this.patchState({
                afterCursor: response.pageInfo.hasNextPage
                  ? response.pageInfo.endCursor
                  : undefined, //update after cursor from response
                hasNextPage: response.pageInfo.hasNextPage,
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

  readonly fetchReposForSpecificUser = this.effect((trigger$) => {
    return trigger$.pipe(
      combineLatestWith(this.sortOrder$, this.searchQuery$, this.pageNo$),
      withLatestFrom(
        this.userName$,
        this.afterCursor$,
        this.hasNextPage$,
        this.userRepos$,
        this.state$,
      ),
      filter(
        ([[, , searchQuery], userName, afterCursor, hasNextPage]) =>
          !!userName && !!hasNextPage && !searchQuery,
      ),
      tap(() => this.patchState({ loadingState: LoadingState.LOADING })),
      switchMap(([[, sortOrder], userName, afterCursor]) => {
        const getRepoForUserPayload: getRepoForUserPayload = {
          userName: userName as string,
          first: TABLE_FETCH_LIMIT,
          after: afterCursor,
          orderBy: sortOrder?.colId ? sortOrder : undefined,
        };
        return this.readRepoService.getRepoForUser(getRepoForUserPayload).pipe(
          tap(() =>
            this.patchState({
              userRepos: [],
            }),
          ),
          tapResponse(
            (response) => {
              this.updateUserRepos(response.data);
              this.patchState({
                afterCursor: response.pageInfo.hasNextPage
                  ? response.pageInfo.endCursor
                  : undefined, //update after cursor from response
                hasNextPage: response.pageInfo.hasNextPage,
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

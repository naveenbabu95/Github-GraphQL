import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideComponentStore } from '@ngrx/component-store';
import { of } from 'rxjs';
import { ReadRepoService } from '@github-graphql-assignment/data-access';
import {
  GetRepoForUserPayload,
  LoadingState,
  RECORDS_TO_BE_SHOWN_FOR_GRAPH,
  RepositoryResponse,
  MOCK_REPOS,
} from '@github-graphql-assignment/util';
import { GraphViewStore } from './graph-view.store';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { createSpyFromClass } from 'jest-auto-spies';

describe('GraphViewStore', () => {
  function setup({
    userName = 'testUser',
    reposResponse = MOCK_REPOS,
    hasError = false,
  } = {}) {
    const mockReadRepoService = createSpyFromClass(ReadRepoService);
    if (hasError) {
      mockReadRepoService.getRepoForUser.throwWith({
        error: {
          code: 404,
        },
      });
    } else {
      mockReadRepoService.getRepoForUser.nextWith({
        totalCount: 2,
        pageInfo: {
          endCursor: 'Y3Vyc29yOnYyOpHOGEiqIw==',
          startCursor: 'Y3Vyc29yOnYyOpHOGEjNTw==',
          hasNextPage: false,
        },
        data: reposResponse,
      });
    }

    const mockActivatedRoute = {
      paramMap: of(new Map([['userName', userName]])),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideComponentStore(GraphViewStore),
        { provide: ReadRepoService, useValue: mockReadRepoService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const store = TestBed.inject(GraphViewStore);

    return {
      store,
      mockReadRepoService,
    };
  }

  it('should initialize with the correct state', () => {
    const { store } = setup();
    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()).toEqual({
      userRepos: MOCK_REPOS,
      totalRecords: 2,
      loadingState: LoadingState.LOADED,
    });
  });

  it('should fetch repos for a specific user on state init', fakeAsync(() => {
    const { store, mockReadRepoService } = setup();
    store.ngrxOnStateInit();

    expect(mockReadRepoService.getRepoForUser).toHaveBeenCalledWith({
      userName: 'testUser',
      first: RECORDS_TO_BE_SHOWN_FOR_GRAPH,
    });
  }));

  it('should update state with fetched repos', fakeAsync(() => {
    const { store } = setup();
    store.ngrxOnStateInit();

    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()?.userRepos).toEqual(MOCK_REPOS);
    expect(state.getLastValue()?.loadingState).toBe(LoadingState.LOADED);
  }));

  //test
  it('should handle errors when fetching repos', fakeAsync(() => {
    const { store } = setup({ hasError: true });
    store.ngrxOnStateInit();

    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()?.loadingState).toBe(LoadingState.ERROR);
  }));

  it('should create the correct view model', fakeAsync(() => {
    const { store } = setup();
    store.ngrxOnStateInit();

    const vm = subscribeSpyTo(store.vm$);
    tick();
    expect(vm.getLastValue()).toEqual({
      graphModel: [
        { x: 'repo1', y: 10 },
        { x: 'repo2', y: 20 },
      ],
      showError: false,
      isLoading: false,
    });
  }));

  //test
  it('should show error in view model when loading state is ERROR', fakeAsync(() => {
    const { store } = setup({ hasError: true });
    store.ngrxOnStateInit();

    const vm = subscribeSpyTo(store.vm$);
    tick();
    expect(vm.getLastValue()?.showError).toBe(true);
  }));
});

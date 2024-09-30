import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideComponentStore } from '@ngrx/component-store';
import { BehaviorSubject } from 'rxjs';
import { ReadRepoService } from '@github-graphql-assignment/data-access';
import {
  COLUMN_DEFINITION_FOR_REPO_TABLE,
  LoadingState,
  SortModel,
  TABLE_FETCH_LIMIT,
  DATA_SUMMARY_MOCK,
} from '@github-graphql-assignment/util';
import { TableViewStore, TableViewVm } from './table-view.store';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { createSpyFromClass } from 'jest-auto-spies';

function runInitMethods(store: TableViewStore): void {
  store.init();
  store.incrementPageNo();
}

describe('TableViewStore', () => {
  function setup({
    userName = 'testUser',
    reposResponse = DATA_SUMMARY_MOCK.data,
    serviceResponse = {
      totalCount: 2,
      pageInfo: {
        endCursor: 'Y3Vyc29yOnYyOpHOGEiqIw==',
        startCursor: 'Y3Vyc29yOnYyOpHOGEjNTw==',
        hasNextPage: false,
      },
      data: DATA_SUMMARY_MOCK.data,
    },
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
      mockReadRepoService.getRepoForUser.nextWith(serviceResponse);
    }

    const paramMapSubject = new BehaviorSubject(
      new Map([['userName', userName]]),
    );

    const mockActivatedRoute = {
      paramMap: paramMapSubject.asObservable(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideComponentStore(TableViewStore),
        { provide: ReadRepoService, useValue: mockReadRepoService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const store = TestBed.inject(TableViewStore);

    return {
      store,
      mockReadRepoService,
      paramMapSubject,
    };
  }

  it('should initialize with the correct state', () => {
    const { store } = setup();
    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()).toEqual({
      userRepos: undefined,
      totalRecords: undefined,
      sortOrder: undefined,
      afterCursor: undefined,
      hasNextPage: true,
      searchQuery: '',
      loadingState: LoadingState.LOADED,
      pageNo: 0,
    });
  });

  it('should fetch repos for a specific user on state init', fakeAsync(() => {
    const { store, mockReadRepoService } = setup();
    runInitMethods(store);
    expect(mockReadRepoService.getRepoForUser).toHaveBeenCalledWith({
      userName: 'testUser',
      first: TABLE_FETCH_LIMIT,
      after: undefined,
      orderBy: undefined,
    });
  }));

  it('should update state with fetched repos', fakeAsync(() => {
    const { store } = setup();
    runInitMethods(store);

    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()?.userRepos).toEqual(DATA_SUMMARY_MOCK.data);
    expect(state.getLastValue()?.loadingState).toBe(LoadingState.LOADED);
  }));

  it('should handle errors when fetching repos', fakeAsync(() => {
    const { store } = setup({ hasError: true });
    runInitMethods(store);

    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()?.loadingState).toBe(LoadingState.ERROR);
  }));

  it('should create the correct view model', fakeAsync(() => {
    const { store } = setup();
    runInitMethods(store);

    const vm = subscribeSpyTo(store.vm$);
    tick();
    expect(vm.getLastValue()).toEqual({
      userRepos: DATA_SUMMARY_MOCK.data,
      totalRecords: 2,
      columnDefs: COLUMN_DEFINITION_FOR_REPO_TABLE,
      showError: false,
      isLoading: false,
    });
  }));

  it('should show error in view model when loading state is ERROR', fakeAsync(() => {
    const { store } = setup({ hasError: true });
    runInitMethods(store);

    const vm = subscribeSpyTo(store.vm$);
    tick();
    expect(vm.getLastValue()?.showError).toBe(true);
  }));

  it('should increment page number', () => {
    const { store } = setup();
    store.incrementPageNo();
    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()?.pageNo).toBe(1);
  });

  it('should update sort order', () => {
    const { store } = setup();
    const sortOrder: SortModel = { colId: 'name', sort: 'asc' };
    store.updateSort(sortOrder);
    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()?.sortOrder).toEqual(sortOrder);
  });

  it('should update state with fetched repos', fakeAsync(() => {
    const { store } = setup({
      serviceResponse: {
        totalCount: 2,
        pageInfo: {
          endCursor: 'Y3Vyc29yOnYyOpHOGEiqIw==',
          startCursor: 'Y3Vyc29yOnYyOpHOGEjNTw==',
          hasNextPage: false,
        },
        data: DATA_SUMMARY_MOCK.data,
      },
    });
    runInitMethods(store);

    const state = subscribeSpyTo(store.state$);
    expect(state.getLastValue()?.afterCursor).toBeUndefined();
  }));
});

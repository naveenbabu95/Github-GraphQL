import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewComponent } from './table-view.component';
import { TableViewStore, TableViewVm } from './table-view.store';
import { createSpyFromClass } from 'jest-auto-spies';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ReadRepoService } from '@github-graphql-assignment/data-access';
import {
  COLUMN_DEFINITION_FOR_REPO_TABLE,
  DATA_SUMMARY_MOCK,
} from '@github-graphql-assignment/util';
import { render, screen } from '@testing-library/angular';
import { By } from '@angular/platform-browser';

const VIEW_MODEL: TableViewVm = {
  userRepos: [],
  totalRecords: 100,
  columnDefs: COLUMN_DEFINITION_FOR_REPO_TABLE,
  showError: false,
  isLoading: false,
};

describe('TableViewComponent', () => {
  async function setup({
    vm = VIEW_MODEL,
    showError = false,
    emptyResponse = false,
  }: {
    vm?: TableViewVm;
    showError?: boolean;
    emptyResponse?: boolean;
  } = {}) {
    const mockComponentStore = createSpyFromClass(TableViewStore, {
      observablePropsToSpyOn: ['vm$'],
      methodsToSpyOn: ['incrementPageNo', 'updateSort'],
    });
    mockComponentStore.vm$.nextWith(vm);

    const paramMapSubject = new BehaviorSubject(
      convertToParamMap({ userName: 'testUser' }),
    );

    const mockApolloService = createSpyFromClass(Apollo);
    const mockReadRepoService = createSpyFromClass(ReadRepoService);
    if (showError) {
      mockReadRepoService.GetRepoForUser.throwWith({
        error: {
          code: 404,
        },
      });
    } else if (emptyResponse) {
      mockReadRepoService.GetRepoForUser.nextWith({
        ...DATA_SUMMARY_MOCK,
        data: [],
      });
    } else {
      mockReadRepoService.GetRepoForUser.nextWith(DATA_SUMMARY_MOCK);
    }

    const { fixture } = await render(TableViewComponent, {
      // declarations: [MockAgGridWrapperComponent], // Declare the mock component
      providers: [
        {
          provide: TableViewStore,
          useValue: mockComponentStore,
        },
        {
          provide: ReadRepoService,
          useValue: mockReadRepoService,
        },
        {
          provide: Apollo,
          useValue: mockApolloService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
          },
        },
      ],
    });
    return { fixture, mockComponentStore, mockReadRepoService };
  }

  it('verifies that error is shown when showError is true in view model', async () => {
    await setup({
      showError: true,
    });
    const errorElement = screen.getByText(
      'Error Occurred While Loading, Please try later',
    );

    expect(errorElement).toBeDefined();
  });

  it('verifies table to be shown when isLoading is false and userRepos has data in view model', async () => {
    await setup();

    const tableElement = screen.getByTestId('table-container');

    expect(tableElement).toBeDefined();
  });

  it('verifies empty message be shown when userRepos is empty', async () => {
    await setup({
      emptyResponse: true,
    });

    const errorElement = screen.getByText('No Records Found');

    expect(errorElement).toBeDefined();
  });

  it('verifies service call when scroll event is triggered', async () => {
    const { fixture, mockReadRepoService } = await setup();

    const mockChild = fixture.debugElement.query(
      By.css('app-ag-grid-wrapper'),
    ).componentInstance;
    expect(mockReadRepoService.GetRepoForUser).toHaveBeenCalledTimes(1);
    mockChild.pageUpdated.emit();

    expect(mockReadRepoService.GetRepoForUser).toHaveBeenCalledTimes(2); //service called again
  });

  it('verifies sort method is called with correct params when user sort is triggered', async () => {
    const { fixture, mockReadRepoService } = await setup();

    const mockChild = fixture.debugElement.query(
      By.css('app-ag-grid-wrapper'),
    ).componentInstance;
    expect(mockReadRepoService.GetRepoForUser).toHaveBeenCalledTimes(1);
    mockChild.sortParamUpdated.emit({ colId: 'name', sort: 'asc' });

    expect(mockReadRepoService.GetRepoForUser).toHaveBeenCalledWith({
      after: '',
      first: 20,
      orderBy: {
        //sort param set
        colId: 'NAME',
        sort: 'ASC',
      },
      userName: 'testUser',
    }); //service called again
  });
});

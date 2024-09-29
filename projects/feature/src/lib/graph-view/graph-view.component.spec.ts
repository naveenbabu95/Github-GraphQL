import { GraphViewComponent } from './graph-view.component';
import { render, screen } from '@testing-library/angular';
import { GraphViewStore, GraphViewVm } from './graph-view.store';
import { createSpyFromClass } from 'jest-auto-spies';
import { ReadRepoService } from '@github-graphql-assignment/data-access';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { DATA_SUMMARY_MOCK } from '@github-graphql-assignment/util';

const VIEW_MODEL: GraphViewVm = {
  graphModel: [
    { x: 'test1', y: 2 },
    { x: 'test2', y: 3 },
  ],
  showError: false,
  isLoading: false,
};

describe('GraphViewComponent', () => {
  async function setup({
    vm = VIEW_MODEL,
    showError = false,
  }: { vm?: GraphViewVm; showError?: boolean } = {}) {
    const mockComponentStore = createSpyFromClass(GraphViewStore, {
      observablePropsToSpyOn: ['vm$'],
    });
    mockComponentStore.vm$.nextWith(vm);

    const paramMapSubject = new BehaviorSubject(
      convertToParamMap({ userName: 'testUser' }),
    );

    const mockApolloService = createSpyFromClass(Apollo);
    const mockReadRepoService = createSpyFromClass(ReadRepoService);
    if (showError) {
      mockReadRepoService.getRepoForUser.throwWith({
        error: {
          code: 404,
        },
      });
    } else {
      mockReadRepoService.getRepoForUser.nextWith(DATA_SUMMARY_MOCK);
    }

    const { fixture } = await render(GraphViewComponent, {
      providers: [
        {
          provide: GraphViewStore,
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
    return { fixture, mockComponentStore };
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

  it('verifies graph shown when isLoading is false and graphModel has data in view model', async () => {
    await setup();

    const graphElement = screen.getByTestId('graph-container');

    expect(graphElement).toBeDefined();
  });
});

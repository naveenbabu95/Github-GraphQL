import { render, screen, fireEvent } from '@testing-library/angular';
import { AgGridWrapperComponent } from './ag-grid-wrapper.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { EventEmitter } from '@angular/core';
import {
  CACHE_BLOCK_SIZE,
  SortModel,
  TABLE_PAGINATION_SIZE,
  TABLE_ROW_MODEL_TYPE,
} from '@github-graphql-assignment/util';

describe('AgGridWrapperComponent', () => {
  async function setup(
    columnDefs: ColDef[] = [],
    rowData: any[] = [],
    totalCount: number = 0,
  ) {
    const { fixture } = await render(AgGridWrapperComponent, {
      componentProperties: {
        columnDefs,
        tableData: { rowData, totalCount },
        pageUpdated: new EventEmitter<Event>(),
        sortParamUpdated: new EventEmitter<SortModel>(),
      },
    });
    return { fixture };
  }

  it('should display the total count of records', async () => {
    const totalCount = 100;
    await setup([], [], totalCount);
    const totalCountElement = screen.getByText(`${totalCount} records`);
    expect(totalCountElement).toBeDefined();
  });

  it('should initialize the grid with the provided column definitions', async () => {
    const columnDefs: ColDef[] = [
      { headerName: 'Name', field: 'name' },
      { headerName: 'Age', field: 'age' },
    ];
    await setup(columnDefs);

    const gridElement = screen.getByRole('grid');
    expect(gridElement).toBeDefined();

    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells.length).toBe(columnDefs.length);
    expect(headerCells[0].textContent?.trim()).toBe('Name');
    expect(headerCells[1].textContent?.trim()).toBe('Age');
  });

  it('should handle grid ready event and set the data source', async () => {
    const { fixture } = await setup();
    const componentInstance = fixture.componentInstance;

    const gridReadyEvent: GridReadyEvent = {
      api: {
        sizeColumnsToFit: jest.fn(),
        setGridOption: jest.fn(),
      },
      columnApi: {},
      type: 'gridReady',
    } as any;

    componentInstance.onGridReady(gridReadyEvent);

    expect(gridReadyEvent.api.sizeColumnsToFit).toHaveBeenCalled();
    expect(gridReadyEvent.api.setGridOption).toHaveBeenCalledWith(
      'datasource',
      componentInstance.dataSource,
    );
  });

  it('should emit sortParamUpdated event when sort parameter changes', async () => {
    const sortParamUpdated = jest.fn();
    const { fixture } = await setup([], [], 0);
    fixture.componentInstance.sortParamUpdated.subscribe(sortParamUpdated);

    const params = {
      sortModel: [{ colId: 'name', sort: 'asc' }],
      successCallback: jest.fn(),
    } as any;

    fixture.componentInstance.dataSource.getRows(params);

    expect(sortParamUpdated).toHaveBeenCalledWith({
      colId: 'name',
      sort: 'asc',
    });
  });

  it('should emit pageUpdated event when page changes', async () => {
    const pageUpdated = jest.fn();
    const { fixture } = await setup([], [], 0);
    fixture.componentInstance.pageUpdated.subscribe(pageUpdated);

    const params = {
      sortModel: [],
      successCallback: jest.fn(),
    } as any;

    fixture.componentInstance.dataSource.getRows(params);

    expect(pageUpdated).toHaveBeenCalled();
  });
});

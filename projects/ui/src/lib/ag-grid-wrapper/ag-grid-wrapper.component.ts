import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CACHE_BLOCK_SIZE,
  SortModel,
  TABLE_PAGINATION_SIZE,
  TABLE_ROW_MODEL_TYPE,
} from '@github-graphql-assignment/util';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  IDatasource,
  GridApi,
  IGetRowsParams,
  createGrid,
  GridReadyEvent,
} from 'ag-grid-community';

/* Core Data Grid CSS */
import 'ag-grid-community/styles/ag-grid.css';
/* Quartz Theme Specific CSS */
import 'ag-grid-community/styles/ag-theme-quartz.css';

@Component({
  selector: 'app-ag-grid-wrapper',
  standalone: true,
  imports: [AgGridAngular, MatProgressSpinnerModule],
  templateUrl: './ag-grid-wrapper.component.html',
  styleUrl: './ag-grid-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgGridWrapperComponent<T extends object> {
  @Output() pageUpdated: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() sortParamUpdated: EventEmitter<SortModel> =
    new EventEmitter<SortModel>();

  @Input({ required: true })
  columnDefs!: ColDef[];
  @Input({ required: true })
  set tableData({ rowData, totalCount }: { rowData: T[]; totalCount: number }) {
    this.totalCount = totalCount;
    this.rowData = [...this.rowData, ...rowData];
    setTimeout(() => {
      this.params.successCallback(rowData, totalCount);
    }, 500);
  }

  rowData: T[] = [];
  gridApi: GridApi<T> | null = null;
  params!: IGetRowsParams;
  paginationPageSize = TABLE_PAGINATION_SIZE;
  rowModelType = TABLE_ROW_MODEL_TYPE;
  cacheBlockSize = CACHE_BLOCK_SIZE;
  totalCount = 0;
  sortParm: SortModel | null = null;
  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.params = params;
      if (
        this.params.sortModel.length &&
        this.sortParm !== this.params.sortModel[0]
      ) {
        //sort param changed
        this.sortParm = this.params.sortModel[0];
        this.sortParamUpdated.emit(this.sortParm as SortModel);
      } else {
        this.pageUpdated.emit();
      }
    },
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
      this.gridApi.setGridOption('datasource', this.dataSource);
    }
  }
}

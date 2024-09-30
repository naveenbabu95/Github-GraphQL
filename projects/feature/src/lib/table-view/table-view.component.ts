import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AgGridWrapperComponent,
  BackButtonComponent,
} from '@github-graphql-assignment/ui';
import { provideComponentStore } from '@ngrx/component-store';
import { TableViewStore, TableViewVm } from './table-view.store';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  SortModel,
  transformSortParamForTable,
} from '@github-graphql-assignment/util';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    CommonModule,
    BackButtonComponent,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    AgGridWrapperComponent,
  ],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
  providers: [TableViewStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableViewComponent implements OnInit {
  vm$: Observable<TableViewVm> = this.componentStore.vm$;
  constructor(private componentStore: TableViewStore) {}

  ngOnInit(): void {
    this.componentStore.init();
    this.componentStore.incrementPageNo(); //get first page
  }
  updatePage(): void {
    this.componentStore.incrementPageNo();
  }

  updateSort(sortParam: SortModel): void {
    this.componentStore.updateSort(transformSortParamForTable(sortParam));
  }

  onSearch(searchQuery: string) {
    // console.log('search'searchQuery);
    this.componentStore.updateSearch(searchQuery);
  }
}

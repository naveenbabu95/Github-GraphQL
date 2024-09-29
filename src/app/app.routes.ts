import { Routes } from '@angular/router';
import {
  GraphViewComponent,
  TableViewComponent,
} from '@github-graphql-assignment/feature';
import {
  PageNotFoundComponent,
  HomeComponent,
} from '@github-graphql-assignment/ui';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'table/:userName', component: TableViewComponent, pathMatch: 'full' },
  { path: 'graph/:userName', component: GraphViewComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

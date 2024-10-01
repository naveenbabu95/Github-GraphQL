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
  {
    path: 'table/:userName',
    loadComponent: () =>
      import('@github-graphql-assignment/feature').then(
        (m) => m.TableViewComponent,
      ),
  },
  {
    path: 'graph/:userName',
    loadComponent: () =>
      import('@github-graphql-assignment/feature').then(
        (m) => m.GraphViewComponent,
      ),
  },
  { path: '**', component: PageNotFoundComponent },
];

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BackButtonComponent,
  D3WrapperComponent,
} from '@github-graphql-assignment/ui';
import { GraphViewStore } from './graph-view.store';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-graph-view',
  standalone: true,
  imports: [
    CommonModule,
    BackButtonComponent,
    D3WrapperComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './graph-view.component.html',
  styleUrl: './graph-view.component.scss',
  providers: [provideComponentStore(GraphViewStore)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphViewComponent {
  readonly vm$ = this.componentStore.vm$;
  constructor(private componentStore: GraphViewStore) {}
}

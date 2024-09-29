import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@github-graphql-assignment/ui';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    FormsModule,

    HeaderComponent,

    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatButtonToggleModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  searchTerm = '';
  viewType = false;

  onSearch(): void {
    if (this.searchTerm) {
      this.viewType = true;
    } else {
      this.viewType = false;
    }
  }
}

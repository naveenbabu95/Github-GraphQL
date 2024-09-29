import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  GraphQLModule,
  ReadRepoService,
} from '@github-graphql-assignment/data-access';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GraphQLModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ReadRepoService],
})
export class AppComponent {}

import { NgModule } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient } from '@angular/common/http';
import { createApollo } from '@github-graphql-assignment/util';

@NgModule({
  imports: [],
  providers: [provideHttpClient(), HttpLink, provideApollo(createApollo)],
})
export class GraphQLModule {}

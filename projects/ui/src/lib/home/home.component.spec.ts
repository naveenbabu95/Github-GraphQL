import { render, screen, fireEvent } from '@testing-library/angular';
import { HomeComponent } from './home.component';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  async function setup() {
    const { fixture } = await render(HomeComponent);
    const router = TestBed.inject(Router);
    return { router, fixture };
  }

  it('checks the table and graph buttons are visible when user types in the input box and click on search', async () => {
    const { fixture } = await setup();
    const inputElement = screen.getByPlaceholderText('Search Username');

    const searchButton = screen.getByText('Search');

    fireEvent.input(inputElement, { target: { value: 'John' } });

    await searchButton.click();
    fixture.detectChanges();
    const tableButton = screen.getByText('Table');
    const graphButton = screen.getByText('Graph');

    expect(tableButton).toBeDefined();
    expect(graphButton).toBeDefined();
  });
  it('checks the table and graph buttons are not visible when search box is empty and user clicks on search', async () => {
    const { fixture } = await setup();

    const searchButton = screen.getByText('Search');
    await searchButton.click();
    fixture.detectChanges();
    const tableButton = screen.queryByText('Table');
    const graphButton = screen.queryByText('Graph');

    expect(tableButton).toBeNull(); //not visible
    expect(graphButton).toBeNull();
  });
});

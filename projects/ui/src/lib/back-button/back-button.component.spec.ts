import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButtonComponent } from './back-button.component';
import { render, screen } from '@testing-library/angular';

describe('BackButtonComponent', () => {
  async function setup() {
    await render(BackButtonComponent);
  }

  it('verify backButton is rendered on UI', async () => {
    await setup();
    const backButton = screen.getByRole('button');
    expect(backButton).toBeDefined();
  });
});

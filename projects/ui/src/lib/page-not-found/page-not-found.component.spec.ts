import { render, screen } from '@testing-library/angular';
import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  async function setup() {
    await render(PageNotFoundComponent);
  }

  it('verify "page not found" text rendered on UI', async () => {
    await setup();
    const pageNotFound = screen.getByText('Page Not Found');
    expect(pageNotFound).toBeDefined();
  });
});

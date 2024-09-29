import { render, screen } from '@testing-library/angular';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  async function setup() {
    await render(HeaderComponent);
  }

  it('verify header is rendered properly on UI', async () => {
    await setup();
    const updatedMessageElement = screen.getByText('GITHUB REPOSITORY FINDER');
    expect(updatedMessageElement).toBeDefined();
  });
});

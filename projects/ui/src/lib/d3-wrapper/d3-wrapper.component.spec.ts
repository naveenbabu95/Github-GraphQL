import {
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  GraphModel,
} from '@github-graphql-assignment/util';
import * as d3 from 'd3';
import { render, screen } from '@testing-library/angular';
import { D3WrapperComponent } from './d3-wrapper.component';

describe('D3WrapperComponent', () => {
  async function setup(data: GraphModel[] = []) {
    const component = await render(D3WrapperComponent, {
      componentProperties: {
        data,
        graphWidth: GRAPH_WIDTH,
        graphHeight: GRAPH_HEIGHT,
      },
    });
    return component;
  }

  it('should render the component', async () => {
    await setup();
    const chartElement = screen.getByTestId('chart-container');
    expect(chartElement).toBeDefined();
  });

  it('should create an SVG element', async () => {
    await setup();
    const svgElement = screen
      .getByTestId('chart-container')
      .querySelector('svg');
    expect(svgElement).toBeDefined();
  });

  it('should draw bars for the provided data', async () => {
    const mockData: GraphModel[] = [
      { x: 'A', y: 10 },
      { x: 'B', y: 20 },
      { x: 'C', y: 30 },
    ];
    await setup(mockData);

    const svgElement = screen
      .getByTestId('chart-container')
      .querySelector('svg');
    const bars = svgElement?.querySelectorAll('rect');
    expect(bars?.length).toBe(mockData.length);
  });
});

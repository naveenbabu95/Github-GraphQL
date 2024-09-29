import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  GRAPH_HEIGHT,
  GRAPH_MARGIN,
  GRAPH_WIDTH,
  GraphModel,
} from '@github-graphql-assignment/util';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './d3-wrapper.component.html',
  styleUrl: './d3-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class D3WrapperComponent implements OnInit {
  @Input({ required: true })
  data!: GraphModel[];
  @Input()
  graphWidth = GRAPH_WIDTH;
  @Input()
  graphHeight = GRAPH_HEIGHT;
  @Input()
  graphMargin = GRAPH_MARGIN;
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  private svg: any;
  private margin = 0;
  private width = 0;
  private height = 0;

  ngOnInit(): void {
    //init graph variables
    this.margin = this.graphMargin;
    this.width = this.graphWidth - this.margin * 2;
    this.height = this.graphHeight - this.margin * 2;

    //build graph
    this.createSvg();
    this.drawBars(this.data);
  }

  private createSvg(): void {
    this.svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      // .attr("width", this.width + (this.margin * 2))
      // .attr("height", this.height + (this.margin * 2))
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 960 500')
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: GraphModel[]): void {
    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.x))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => (d.y as number) + 2) as number])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: GraphModel) => x(d.x))
      .attr('y', (d: GraphModel) => y(d.y))
      .attr('width', x.bandwidth())
      .attr('height', (d: GraphModel) => this.height - y(d.y))
      .attr('fill', '#d04a35');
  }
}

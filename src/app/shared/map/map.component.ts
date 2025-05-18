import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import { geoMercator } from 'd3-geo';
import { feature, neighbors } from 'topojson-client';
import { mapData } from './map-data';

// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements AfterViewInit {
  state: { worlddata: any; neighbors: any };
  width = 1000;
  height = 600;
  initialScale = 200;

  lastScale = 0;
  centerX = 0;
  centerY = 0;
  lastCenterX = 0;
  lastCenterY = 0;

  countryColors = [];

  projection = geoMercator()
    .scale(this.initialScale)
    .center([0, 0]);

  zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .on('zoom', (event: any) => {
      const features = d3.selectAll('.country');
      let t = event.transform;

      const scale = t.k * this.initialScale;
      const centerY = t.y;
      const centerX = t.x;
      let updated = false;

      if (scale !== this.lastScale) {
        this.projection.scale(scale);
        this.lastScale = scale;
        updated = true;
      }
      if (centerX !== this.lastCenterX || centerY !== this.lastCenterY) {
        // this.projection.center([centerY, centerX]);
        updated = true;
        console.log(this.projection.scale(), scale, t.k, t.y);
      }

      if (updated) {
        const path = d3.geoPath().projection(this.projection);
        features.attr('d', path);
      }
    });

  ngAfterViewInit() {
    this.state = {
      worlddata: feature(mapData, mapData.objects.countries),
      neighbors: neighbors(mapData.objects.countries.geometries)
    };

    this.state.worlddata.features.forEach((country: any, index: number) => {
      this.countryColors.push(
        `rgba(30,80,100,${((1 / this.state.worlddata.features.length) * index) /
          2 +
          0.5})`
      );
    });

    this.renderMap();
  }

  renderMap() {
    const svg = d3.select('#mapCanvas');

    svg
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g');
    svg.call(this.zoom);
    this.redraw();
  }

  redraw() {
    const svg = d3.select('#mapCanvas');
    const path = d3.geoPath().projection(this.projection);

    svg
      .selectAll('path.country')
      .data(this.state.worlddata.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'country')
      .attr('fill', (d: any, index: number) => {
        return this.countryColors[index];
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.2)
      .on('mouseover', (event: MouseEvent, d: any) => {
        this.hoverHandler(event);
      })
      .on('mouseout', (event: MouseEvent, d: any) => {
        this.hoverHandler(event, d);
      });
  }

  hoverHandler(event: MouseEvent, d?: any) {
    const node = d3.select(event.currentTarget);
    if (d) {
      node.attr(
        'fill',
        this.countryColors[this.state.worlddata.features.indexOf(d)]
      );
    } else {
      node.attr('fill', 'rgba(255, 255, 0, 0.25)');
    }
  }
}

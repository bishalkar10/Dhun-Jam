import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function BarChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    // Select the chart container element
    const chartContainer = d3.select(chartRef.current);

    // Clear any existing chart
    chartContainer.selectAll("*").remove();

    // Set up the chart dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the x and y scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.6);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) / 0.9]) // Add some padding to the top of the y-axis
      .range([innerHeight, 0]);

    // Create the chart container
    const chart = chartContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the x-axis
    chart
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0).tickPadding(10));

    // Create the y-axis
    chart
      .append("g")
      .call(d3.axisLeft(yScale).tickFormat("").tickSize(0));

    // Create the bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value));
  }, [data]);

  return <div ref={chartRef} className="chart-container"></div>;
}


const drawBars = async () => {
    const data = await d3.json('./../data/seattle_wa_weather_data.json')
    
    const width = 600

    const dimensions = {
        width,
        height: width * 0.6,
        margin: {
            top: 30,
            right: 10,
            bottom: 50,
            left: 50,
        }
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    const wrapper = d3.select('#wrapper')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height',dimensions.height)
        .style('background-color', '#f0f0f0')

    const bounds = wrapper.append('g')
        .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)

    const xAccessor = (d) => d.humidity
    const yAccessor = (d) => d.length

    const scaleX = d3.scaleLinear()
    .domain(d3.extent(data,xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

    const binGenerator = d3.bin()
    .domain(scaleX.domain())
    .value(xAccessor)
    .thresholds(12)

    const bins = binGenerator(data)

    const scaleY = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

    // draw Data
    const boundGroup = bounds.append('g')

    const boundGroups = boundGroup.selectAll('g')
        .data(bins)
        .join('g')

    const barPadding = 1

    const barRect = boundGroups.append('rect')
        .attr('x', d => scaleX(d.x0) + barPadding / 2)
        .attr('y', (d) => scaleY(yAccessor(d)))
        .attr('width', (d) => scaleX(d.x1) - scaleX(d.x0) - barPadding)
        .attr('height', (d) => dimensions.boundedHeight - scaleY(yAccessor(d)))
        .attr('fill', 'cornflowerblue')
    
    const barText = boundGroups.append('text')
        .text((d) => d.length)
        .attr('x', (d) => scaleX(d.x0) + (scaleX(d.x1) - scaleX(d.x0)) / 2)
        .attr('y', (d) => scaleY(yAccessor(d)) - 5)
        .attr('fill', 'black')
        .style('font-size', '12px')
        .style('text-anchor', 'middle')
    
    const mean = d3.mean(data, xAccessor)
    const meanLine = bounds.append('line')
    .attr('x1', scaleX(mean))
    .attr('y1', 0)
    .attr('x2', scaleX(mean))
    .attr('y2', dimensions.boundedHeight)
    .attr('stroke', 'black')
    .attr('stroke-dasharray', '4,4')

    const meanLabel = bounds.append('text')
        .text('mean')
        .attr('x', scaleX(mean))
        .attr('y', -5)
        .attr('fill', 'black')
        .style('font-size', '12px')
        .style('text-anchor', 'middle')
    
    const xAxisGenerator = d3.axisBottom().scale(scaleX)
    const xAxis = bounds.append('g').call(xAxisGenerator).attr('transform', `translate(0, ${dimensions.boundedHeight})`)
    
    const yAxisGenerator = d3.axisLeft().scale(scaleY)
    const yAxis = bounds.append('g').call(yAxisGenerator)
    console.log(scaleX.domain(), bins)
}
drawBars()
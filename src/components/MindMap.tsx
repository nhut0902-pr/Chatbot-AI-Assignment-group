import React, { useRef, useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';
import { SettingsContext } from '../contexts/SettingsContext';

interface MindMapProps {
  data: MindMapNode;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme, accentColor } = useContext(SettingsContext);

  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const isDarkMode = theme === 'dark';
    
    const accentColorMap = {
        indigo: { parent: '#4F46E5', child: '#818CF8' },
        blue: { parent: '#2563EB', child: '#60A5FA' },
        green: { parent: '#16A34A', child: '#4ADE80' },
        orange: { parent: '#EA580C', child: '#FB923C' },
        rose: { parent: '#E11D48', child: '#F472B6' },
    };

    const currentAccent = accentColorMap[accentColor] || accentColorMap.indigo;

    const linkColor = isDarkMode ? '#4A5568' : '#CBD5E0';
    const textColor = isDarkMode ? '#E2E8F0' : '#1E293B';
    const parentNodeColor = isDarkMode ? currentAccent.parent : currentAccent.parent;
    const childNodeColor = isDarkMode ? currentAccent.child : currentAccent.child;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    const { width, height } = svg.node()!.getBoundingClientRect();
    const margin = { top: 50, right: 120, bottom: 50, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g");
    
    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        g.attr("transform", event.transform);
    });
    
    svg.call(zoom);

    const treeLayout = d3.tree<MindMapNode>().size([innerHeight, innerWidth]);
    const root = d3.hierarchy(data);
    treeLayout(root);
    
    // Center the tree
    const transform = d3.zoomIdentity.translate(margin.left, height / 2).scale(0.8);
    g.attr('transform', transform.toString());
    svg.call(zoom.transform, transform);


    const linkGenerator = d3.linkHorizontal<any, d3.HierarchyPointNode<MindMapNode>>()
        .x(d => d.y)
        .y(d => d.x);

    g.selectAll('path.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkGenerator)
      .attr('fill', 'none')
      .attr('stroke', linkColor)
      .attr('stroke-width', 2);

    const node = g.selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
      .attr('r', 8)
      .attr('fill', d => d.children ? parentNodeColor : childNodeColor)
      .attr('stroke', isDarkMode ? '#1E293B' : '#FFFFFF')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.data.name)
      .attr('dy', '0.31em')
      .attr('x', d => d.children ? -15 : 15)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .attr('fill', textColor)
      .style('font-size', '14px')
      .style('font-family', 'sans-serif');

  }, [data, theme, accentColor]);

  return <svg ref={svgRef} width="100%" height="100%"></svg>;
};

export default MindMap;
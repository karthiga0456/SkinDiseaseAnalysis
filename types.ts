
export interface HeatmapRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Analysis {
  condition: string;
  confidence: number;
  explanation: string;
  heatmap_region: HeatmapRegion | null;
}

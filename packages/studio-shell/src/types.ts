import type { Route } from 'next';
export type { OutputClass, OutputPreset } from './outputPresets';

export type ToolkitCapability = {
  id: string;
  label: string;
};

export type ToolkitDefinition = {
  id: 'motion-toolkit' | 'dataviz-toolkit' | 'social-card-toolkit';
  label: string;
  summary: string;
  href?: Route;
  status: 'live' | 'planned';
  capabilities: ToolkitCapability[];
};

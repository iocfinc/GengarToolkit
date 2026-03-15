import { ToolkitLauncher } from '@packages/studio-shell/src/ToolkitLauncher';
import { toolkitRegistry } from '@/lib/toolkits';

export default function HomePage() {
  return (
    <ToolkitLauncher
      title="Brand Toolkit Suite"
      subtitle="A shared internal platform for branded motion scenes, editorial data visualization, and social publishing templates."
      toolkits={toolkitRegistry}
    />
  );
}

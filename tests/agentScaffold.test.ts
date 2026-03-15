import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const codexConfigPath = path.join(repoRoot, '.codex', 'config.toml');
const codexConfigDir = path.dirname(codexConfigPath);
const skillsPath = path.join(repoRoot, 'skills.md');
const prTemplatePath = path.join(repoRoot, '.github', 'pull_request_template.md');
const agentsDir = path.join(repoRoot, 'agents');

function readText(filePath: string) {
  return readFileSync(filePath, 'utf8');
}

function extractAgentIds(config: string) {
  return Array.from(config.matchAll(/^\[agents\.([a-z_]+)\]$/gm)).map((match) => match[1]);
}

function extractConfigFiles(config: string) {
  return Array.from(config.matchAll(/config_file = "([^"]+)"/g)).map((match) => match[1]);
}

describe('multi-agent scaffold', () => {
  it('tracks the codex config and referenced agent profiles', () => {
    expect(existsSync(codexConfigPath)).toBe(true);

    const config = readText(codexConfigPath);
    const configFiles = extractConfigFiles(config);
    const agentFiles = readdirSync(agentsDir).filter((entry) => entry.endsWith('.toml'));

    expect(configFiles.length).toBeGreaterThan(0);
    expect(agentFiles.sort()).toEqual(
      configFiles.map((entry) => path.basename(entry)).sort()
    );

    for (const file of configFiles) {
      expect(existsSync(path.resolve(codexConfigDir, file))).toBe(true);
    }
  });

  it('keeps documented role ids aligned with the codex config', () => {
    const config = readText(codexConfigPath);
    const skills = readText(skillsPath);
    const roleIds = extractAgentIds(config);

    expect(roleIds).toContain('browser_screenshot');

    for (const roleId of roleIds) {
      expect(skills).toContain(`\`${roleId}\``);
    }
  });

  it('documents screenshot-based visual validation in contributor docs', () => {
    const skills = readText(skillsPath);
    const prTemplate = readText(prTemplatePath);

    expect(skills).toContain('Chrome MCP');
    expect(skills).toContain('soft-required for frontend-affecting work');
    expect(prTemplate).toContain('## Visual Validation');
    expect(prTemplate).toContain('skip reason');
  });
});

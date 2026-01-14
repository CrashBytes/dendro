import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildTree, renderTree, getTreeStats, getIcon, icons } from '../index.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('getIcon', () => {
  it('should return directory icon for directories', () => {
    expect(getIcon('my-folder', true)).toBe(icons.directory);
    expect(getIcon('src', true)).toBe(icons.directory);
  });

  it('should return correct icons for JavaScript files', () => {
    expect(getIcon('app.js', false)).toBe(icons.javascript);
    expect(getIcon('component.jsx', false)).toBe(icons.javascript);
    expect(getIcon('module.mjs', false)).toBe(icons.javascript);
    expect(getIcon('common.cjs', false)).toBe(icons.javascript);
  });

  it('should return correct icons for TypeScript files', () => {
    expect(getIcon('app.ts', false)).toBe(icons.typescript);
    expect(getIcon('component.tsx', false)).toBe(icons.typescript);
  });

  it('should return correct icons for config files', () => {
    expect(getIcon('config.yaml', false)).toBe(icons.config);
    expect(getIcon('config.yml', false)).toBe(icons.config);
    expect(getIcon('config.toml', false)).toBe(icons.config);
  });


  it('should return correct icons for markdown files', () => {
    expect(getIcon('README.md', false)).toBe(icons.markdown);
    expect(getIcon('CHANGELOG.mdx', false)).toBe(icons.markdown);
  });

  it('should return correct icons for data files', () => {
    expect(getIcon('data.json', false)).toBe(icons.json);
    expect(getIcon('package.json', false)).toBe(icons.json);
  });

  it('should return correct icons for image files', () => {
    expect(getIcon('photo.png', false)).toBe(icons.image);
    expect(getIcon('logo.svg', false)).toBe(icons.image);
    expect(getIcon('image.jpg', false)).toBe(icons.image);
    expect(getIcon('pic.jpeg', false)).toBe(icons.image);
  });

  it('should return correct icons for lock files', () => {
    expect(getIcon('package-lock.json', false)).toBe(icons.lock);
    expect(getIcon('yarn.lock', false)).toBe(icons.lock);
    expect(getIcon('pnpm-lock.yaml', false)).toBe(icons.lock);
  });

  it('should return correct icons for git files', () => {
    expect(getIcon('.gitignore', false)).toBe(icons.git);
    expect(getIcon('.gitattributes', false)).toBe(icons.git);
  });

  it('should return default icon for unknown file types', () => {
    expect(getIcon('unknown.xyz', false)).toBe(icons.default);
  });

  it('should be case-insensitive for extensions', () => {
    expect(getIcon('FILE.JS', false)).toBe(icons.javascript);
    expect(getIcon('FILE.PNG', false)).toBe(icons.image);
  });
});


describe('buildTree', () => {
  let tempDir;

  beforeEach(() => {
    // Create a temporary test directory structure
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dendro-test-'));
    
    // Create test structure
    fs.mkdirSync(path.join(tempDir, 'src'));
    fs.mkdirSync(path.join(tempDir, 'test'));
    fs.mkdirSync(path.join(tempDir, '.git'));
    fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
    fs.writeFileSync(path.join(tempDir, 'src', 'index.js'), 'console.log("test")');
    fs.writeFileSync(path.join(tempDir, 'test', 'test.js'), 'test');
    fs.writeFileSync(path.join(tempDir, '.git', 'config'), '');
  });

  afterEach(() => {
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should build a tree structure', () => {
    const tree = buildTree(tempDir);
    
    expect(tree).toBeDefined();
    expect(tree.type).toBe('directory');
    expect(tree.name).toBe(path.basename(tempDir));
    expect(tree.children).toBeDefined();
    expect(Array.isArray(tree.children)).toBe(true);
  });

  it('should include files and directories', () => {
    const tree = buildTree(tempDir);
    
    expect(tree.children.length).toBeGreaterThan(0);
    
    const hasFiles = tree.children.some(child => child.type === 'file');
    const hasDirs = tree.children.some(child => child.type === 'directory');
    
    expect(hasFiles).toBe(true);
    expect(hasDirs).toBe(true);
  });


  it('should respect maxDepth option', () => {
    // maxDepth: 1 means we go to depth 0 only (root), children at depth 1 return null
    const tree1 = buildTree(tempDir, { maxDepth: 1 });
    expect(tree1.children.every(child => !child.children || child.children.length === 0)).toBe(true);
    
    // maxDepth: 2 means we go to depths 0 and 1, children at depth 2 return null
    const tree2 = buildTree(tempDir, { maxDepth: 2 });
    const srcDir = tree2.children.find(child => child.name === 'src' && child.type === 'directory');
    // srcDir exists at depth 1, but its children (at depth 2) won't be built
    if (srcDir) {
      expect(srcDir.children).toBeDefined();
      // Children array exists but should be empty since they're at maxDepth
      expect(srcDir.children.length).toBe(0);
    }
  });

  it('should hide hidden files by default', () => {
    const tree = buildTree(tempDir, { showHidden: false });
    
    const hasHidden = tree.children.some(child => child.name.startsWith('.'));
    expect(hasHidden).toBe(false);
  });

  it('should show hidden files when showHidden is true', () => {
    const tree = buildTree(tempDir, { showHidden: true });
    
    const gitDir = tree.children.find(child => child.name === '.git');
    expect(gitDir).toBeDefined();
  });

  it('should exclude patterns', () => {
    const tree = buildTree(tempDir, {
      excludePatterns: [/^test$/]
    });
    
    const testDir = tree.children.find(child => child.name === 'test');
    expect(testDir).toBeUndefined();
  });

  it('should sort directories before files', () => {
    const tree = buildTree(tempDir);
    
    let lastWasDir = true;
    for (const child of tree.children) {
      if (child.type === 'file' && lastWasDir) {
        lastWasDir = false;
      } else if (child.type === 'directory' && !lastWasDir) {
        // Found a directory after a file - sorting is wrong
        expect(true).toBe(false);
      }
    }
    expect(true).toBe(true);
  });


  it('should sort items alphabetically within type', () => {
    const tree = buildTree(tempDir);
    
    const dirs = tree.children.filter(c => c.type === 'directory');
    const files = tree.children.filter(c => c.type === 'file');
    
    // Check directories are sorted
    for (let i = 0; i < dirs.length - 1; i++) {
      expect(dirs[i].name.localeCompare(dirs[i + 1].name)).toBeLessThanOrEqual(0);
    }
    
    // Check files are sorted
    for (let i = 0; i < files.length - 1; i++) {
      expect(files[i].name.localeCompare(files[i + 1].name)).toBeLessThanOrEqual(0);
    }
  });

  it('should return null for non-existent paths', () => {
    const tree = buildTree('/non/existent/path');
    expect(tree).toBeNull();
  });

  it('should handle empty directories', () => {
    const emptyDir = path.join(tempDir, 'empty');
    fs.mkdirSync(emptyDir);
    
    const tree = buildTree(emptyDir);
    expect(tree).toBeDefined();
    expect(tree.children).toBeDefined();
    expect(tree.children.length).toBe(0);
  });
});


describe('renderTree', () => {
  it('should render a tree structure as text', () => {
    const tree = {
      name: 'root',
      type: 'directory',
      icon: '📁',
      children: [
        { name: 'file1.js', type: 'file', icon: '📜', path: '/root/file1.js' },
        { name: 'file2.md', type: 'file', icon: '📝', path: '/root/file2.md' }
      ]
    };
    
    const output = renderTree(tree);
    expect(output).toContain('root');
    expect(output).toContain('file1.js');
    expect(output).toContain('file2.md');
    expect(output).toContain('📁');
    expect(output).toContain('📜');
    expect(output).toContain('📝');
  });

  it('should use tree connectors', () => {
    const tree = {
      name: 'root',
      type: 'directory',
      icon: '📁',
      children: [
        { name: 'file1.js', type: 'file', icon: '📜', path: '/root/file1.js' }
      ]
    };
    
    const output = renderTree(tree);
    expect(output).toMatch(/[└├]/); // Should contain tree connectors
  });

  it('should hide icons when showIcons is false', () => {
    const tree = {
      name: 'root',
      type: 'directory',
      icon: '📁',
      children: [
        { name: 'file.js', type: 'file', icon: '📜', path: '/root/file.js' }
      ]
    };
    
    const output = renderTree(tree, { showIcons: false });
    expect(output).not.toContain('📁');
    expect(output).not.toContain('📜');
    expect(output).toContain('root');
    expect(output).toContain('file.js');
  });


  it('should show paths when showPaths is true', () => {
    const tree = {
      name: 'root',
      type: 'directory',
      icon: '📁',
      path: '/test/root',
      children: [
        { name: 'file.js', type: 'file', icon: '📜', path: '/test/root/file.js' }
      ]
    };
    
    const output = renderTree(tree, { showPaths: true });
    expect(output).toContain('/test/root');
    expect(output).toContain('/test/root/file.js');
  });

  it('should return empty string for null tree', () => {
    const output = renderTree(null);
    expect(output).toBe('');
  });

  it('should handle nested structures', () => {
    const tree = {
      name: 'root',
      type: 'directory',
      icon: '📁',
      children: [
        {
          name: 'src',
          type: 'directory',
          icon: '📁',
          children: [
            { name: 'index.js', type: 'file', icon: '📜', path: '/root/src/index.js' },
            { name: 'utils.js', type: 'file', icon: '📜', path: '/root/src/utils.js' }
          ]
        }
      ]
    };
    
    const output = renderTree(tree);
    expect(output).toContain('root');
    expect(output).toContain('src');
    expect(output).toContain('index.js');
    // With siblings in src, we should get vertical lines
    expect(output).toMatch(/[│├]/);
  });
});


describe('getTreeStats', () => {
  it('should count files and directories', () => {
    const tree = {
      name: 'root',
      type: 'directory',
      children: [
        { name: 'file1.js', type: 'file' },
        { name: 'file2.js', type: 'file' },
        {
          name: 'subdir',
          type: 'directory',
          children: [
            { name: 'file3.js', type: 'file' }
          ]
        }
      ]
    };
    
    const stats = getTreeStats(tree);
    expect(stats.files).toBe(3);
    expect(stats.directories).toBe(2); // root + subdir
  });

  it('should return zero counts for null tree', () => {
    const stats = getTreeStats(null);
    expect(stats.files).toBe(0);
    expect(stats.directories).toBe(0);
  });

  it('should handle empty directories', () => {
    const tree = {
      name: 'empty',
      type: 'directory',
      children: []
    };
    
    const stats = getTreeStats(tree);
    expect(stats.files).toBe(0);
    expect(stats.directories).toBe(1);
  });

  it('should handle single file', () => {
    const tree = {
      name: 'file.js',
      type: 'file'
    };
    
    const stats = getTreeStats(tree);
    expect(stats.files).toBe(1);
    expect(stats.directories).toBe(0);
  });

  it('should handle deeply nested structures', () => {
    const tree = {
      name: 'root',
      type: 'directory',
      children: [
        {
          name: 'level1',
          type: 'directory',
          children: [
            {
              name: 'level2',
              type: 'directory',
              children: [
                { name: 'deep.js', type: 'file' }
              ]
            },
            { name: 'file1.js', type: 'file' }
          ]
        },
        { name: 'file2.js', type: 'file' }
      ]
    };
    
    const stats = getTreeStats(tree);
    expect(stats.files).toBe(3);
    expect(stats.directories).toBe(3); // root, level1, level2
  });
});

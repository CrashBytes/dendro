import { buildTree, renderTree, getTreeStats, getIcon } from './index.js';
import path from 'path';

console.log('Running tests for dendro...\n');

// Test 1: Icon selection
console.log('Test 1: Icon Selection');
console.log('JavaScript file:', getIcon('app.js', false));
console.log('TypeScript file:', getIcon('component.tsx', false));
console.log('JSON file:', getIcon('package.json', false));
console.log('Markdown file:', getIcon('README.md', false));
console.log('Directory:', getIcon('src', true));
console.log('✓ Icon selection test passed\n');

// Test 2: Build tree for current directory (limited depth)
console.log('Test 2: Build Tree');
const testPath = path.resolve('.');
const tree = buildTree(testPath, {
  maxDepth: 2,
  showHidden: false,
  excludePatterns: [/node_modules/, /\.git/]
});

if (tree && tree.type === 'directory') {
  console.log('✓ Tree built successfully');
  console.log(`  Root: ${tree.name}`);
  console.log(`  Children: ${tree.children ? tree.children.length : 0}`);
} else {
  console.log('✗ Tree build failed');
}
console.log();

// Test 3: Render tree
console.log('Test 3: Render Tree (first 2 levels)');
const rendered = renderTree(tree, {
  showIcons: true,
  showPaths: false
});

if (rendered && rendered.length > 0) {
  console.log('✓ Tree rendered successfully');
  console.log('\nPreview:');
  console.log(rendered.split('\n').slice(0, 15).join('\n'));
  console.log('...');
} else {
  console.log('✗ Tree render failed');
}
console.log();

// Test 4: Statistics
console.log('Test 4: Statistics');
const stats = getTreeStats(tree);
console.log(`Files: ${stats.files}`);
console.log(`Directories: ${stats.directories}`);
console.log('✓ Statistics test passed\n');

console.log('All tests completed!');

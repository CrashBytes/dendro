#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const { buildTree, renderTree, getTreeStats } = require('../index');

const program = new Command();

program
  .name('dendro')
  .description('Display directory tree structure with beautiful icons')
  .version('1.0.0')
  .argument('[path]', 'Directory path to display', '.')
  .option('-d, --max-depth <number>', 'Maximum depth to traverse', parseInt)
  .option('-a, --all', 'Show hidden files and directories', false)
  .option('--no-icons', 'Disable file type icons')
  .option('-p, --show-paths', 'Show full paths', false)
  .option('-e, --exclude <patterns...>', 'Patterns to exclude (regex)')
  .option('--no-stats', 'Hide statistics summary')
  .action((dirPath, options) => {
    try {
      const fullPath = path.resolve(dirPath);
      
      console.log(chalk.bold.cyan(`\n🌳 Directory Tree: ${fullPath}\n`));
      
      // Build exclude patterns
      const excludePatterns = options.exclude 
        ? options.exclude.map(p => new RegExp(p))
        : [];
      
      // Common excludes by default
      if (!options.all) {
        excludePatterns.push(
          /^node_modules$/,
          /^\.git$/,
          /^\.DS_Store$/,
          /^dist$/,
          /^build$/,
          /^coverage$/
        );
      }
      
      // Build the tree
      const tree = buildTree(fullPath, {
        maxDepth: options.maxDepth || Infinity,
        showHidden: options.all,
        excludePatterns
      });
      
      if (!tree) {
        console.log(chalk.red('Error: Could not read directory'));
        process.exit(1);
      }
      
      // Render the tree
      const output = renderTree(tree, {
        showIcons: options.icons,
        showPaths: options.showPaths
      });
      
      console.log(output);
      
      // Show statistics
      if (options.stats) {
        const stats = getTreeStats(tree);
        console.log(chalk.dim(`\n${stats.directories} directories, ${stats.files} files`));
      }
      
      console.log(); // Empty line at the end
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();

import fs from 'fs';
import path from 'path';

// Icon mappings for different file types and directories
const icons = {
  // Directory
  directory: '📁',
  directoryOpen: '📂',
  
  // Common file types
  javascript: '📜',
  typescript: '📘',
  json: '📋',
  markdown: '📝',
  text: '📄',
  image: '🖼️',
  video: '🎬',
  audio: '🎵',
  pdf: '📕',
  zip: '🗜️',
  executable: '⚙️',
  config: '⚙️',
  css: '🎨',
  html: '🌐',
  database: '🗄️',
  lock: '🔒',
  git: '📦',
  
  // Default
  default: '📄'
};

// File extension to icon mapping
const extensionMap = {
  // JavaScript/TypeScript
  '.js': icons.javascript,
  '.jsx': icons.javascript,
  '.ts': icons.typescript,
  '.tsx': icons.typescript,
  '.mjs': icons.javascript,
  '.cjs': icons.javascript,
  
  // Data formats
  '.json': icons.json,
  '.yaml': icons.config,
  '.yml': icons.config,
  '.xml': icons.config,
  '.toml': icons.config,
  '.ini': icons.config,
  
  // Markdown/Documentation
  '.md': icons.markdown,
  '.mdx': icons.markdown,
  '.txt': icons.text,
  '.pdf': icons.pdf,
  
  // Web
  '.html': icons.html,
  '.htm': icons.html,
  '.css': icons.css,
  '.scss': icons.css,
  '.sass': icons.css,
  '.less': icons.css,
  
  // Images
  '.png': icons.image,
  '.jpg': icons.image,
  '.jpeg': icons.image,
  '.gif': icons.image,
  '.svg': icons.image,
  '.webp': icons.image,
  '.ico': icons.image,
  '.bmp': icons.image,
  
  // Video
  '.mp4': icons.video,
  '.avi': icons.video,
  '.mov': icons.video,
  '.mkv': icons.video,
  '.webm': icons.video,
  
  // Audio
  '.mp3': icons.audio,
  '.wav': icons.audio,
  '.ogg': icons.audio,
  '.m4a': icons.audio,
  '.flac': icons.audio,
  
  // Archives
  '.zip': icons.zip,
  '.tar': icons.zip,
  '.gz': icons.zip,
  '.rar': icons.zip,
  '.7z': icons.zip,
  
  // Databases
  '.db': icons.database,
  '.sqlite': icons.database,
  '.sql': icons.database,
  
  // Executables
  '.exe': icons.executable,
  '.sh': icons.executable,
  '.bat': icons.executable,
  '.cmd': icons.executable,
  
  // Lock files
  '.lock': icons.lock,
};

// Special filename mappings
const filenameMap = {
  '.gitignore': icons.git,
  '.gitattributes': icons.git,
  '.gitmodules': icons.git,
  'package.json': icons.json,
  'package-lock.json': icons.lock,
  'yarn.lock': icons.lock,
  'pnpm-lock.yaml': icons.lock,
  '.env': icons.config,
  '.env.local': icons.config,
  '.env.development': icons.config,
  '.env.production': icons.config,
  'Dockerfile': icons.config,
  'docker-compose.yml': icons.config,
  'README.md': icons.markdown,
};

/**
 * Get the appropriate icon for a file or directory
 */
function getIcon(filename, isDirectory) {
  if (isDirectory) {
    return icons.directory;
  }
  
  // Check special filenames first
  if (filenameMap[filename]) {
    return filenameMap[filename];
  }
  
  // Check by extension
  const ext = path.extname(filename).toLowerCase();
  if (extensionMap[ext]) {
    return extensionMap[ext];
  }
  
  return icons.default;
}

/**
 * Build directory tree structure
 */
function buildTree(dirPath, options = {}) {
  const {
    maxDepth = Infinity,
    currentDepth = 0,
    showHidden = false,
    excludePatterns = []
  } = options;
  
  if (currentDepth >= maxDepth) {
    return null;
  }
  
  try {
    const stats = fs.statSync(dirPath);
    const name = path.basename(dirPath);
    
    // Check if should exclude
    if (!showHidden && name.startsWith('.')) {
      return null;
    }
    
    for (const pattern of excludePatterns) {
      if (name.match(pattern)) {
        return null;
      }
    }
    
    if (!stats.isDirectory()) {
      return {
        name,
        type: 'file',
        icon: getIcon(name, false),
        path: dirPath
      };
    }
    
    // It's a directory
    const children = [];
    const entries = fs.readdirSync(dirPath);
    
    for (const entry of entries) {
      const childPath = path.join(dirPath, entry);
      const childTree = buildTree(childPath, {
        ...options,
        currentDepth: currentDepth + 1
      });
      
      if (childTree) {
        children.push(childTree);
      }
    }
    
    // Sort: directories first, then files, alphabetically
    children.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    return {
      name,
      type: 'directory',
      icon: getIcon(name, true),
      path: dirPath,
      children
    };
  } catch (error) {
    console.error(`Error reading ${dirPath}:`, error.message);
    return null;
  }
}

/**
 * Render the tree structure as text
 */
function renderTree(tree, options = {}) {
  const {
    prefix = '',
    isLast = true,
    showIcons = true,
    showPaths = false
  } = options;
  
  if (!tree) return '';
  
  const lines = [];
  const connector = isLast ? '└── ' : '├── ';
  const icon = showIcons ? `${tree.icon} ` : '';
  const pathInfo = showPaths ? ` (${tree.path})` : '';
  
  lines.push(`${prefix}${connector}${icon}${tree.name}${pathInfo}`);
  
  if (tree.children && tree.children.length > 0) {
    const newPrefix = prefix + (isLast ? '    ' : '│   ');
    
    tree.children.forEach((child, index) => {
      const childIsLast = index === tree.children.length - 1;
      lines.push(renderTree(child, {
        ...options,
        prefix: newPrefix,
        isLast: childIsLast
      }));
    });
  }
  
  return lines.join('\n');
}

/**
 * Get statistics about the tree
 */
function getTreeStats(tree) {
  if (!tree) {
    return { files: 0, directories: 0 };
  }
  
  let files = 0;
  let directories = 0;
  
  if (tree.type === 'file') {
    files = 1;
  } else if (tree.type === 'directory') {
    directories = 1;
    if (tree.children) {
      tree.children.forEach(child => {
        const childStats = getTreeStats(child);
        files += childStats.files;
        directories += childStats.directories;
      });
    }
  }
  
  return { files, directories };
}

export {
  buildTree,
  renderTree,
  getTreeStats,
  getIcon,
  icons
};

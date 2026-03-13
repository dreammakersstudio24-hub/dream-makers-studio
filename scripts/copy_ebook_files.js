const fs = require('fs');
const path = require('path');

const srcDir = 'D:\\dreammakersstudio\\Ebook1.1';
const destDir = 'C:\\Users\\home\\.gemini\\antigravity\\playground\\dream-makers-studio\\public\\Ebook';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.jpeg') || file.endsWith('.pdf')) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to ${destDir}`);
  }
});
console.log('Done.');

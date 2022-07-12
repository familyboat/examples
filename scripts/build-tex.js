const path = require('path');
const process = require('process');
const fs = require('fs');
const { exec } = require("child_process");

const cwd = __dirname;
const root = path.dirname(cwd);
let mathematics = path.join(root, 'mathematics');

// 读取参数
const args = process.argv.slice(2);
const subDir = args.shift() || '';
const update = !!(args.shift()) || false;
mathematics = path.join(mathematics, subDir);

const fileWithSuffix = (file, suffix) => {
  const stat = fs.lstatSync(file);
  return stat.isFile() && file.endsWith(suffix)
}

const travel = (root) => {
  const files = fs.readdirSync(root);

  // 判断 files 中是否包含 tex 类型的文件
  const tex = files.filter(file => fileWithSuffix(path.join(root, file), 'tex'));
  const html = files.filter(file => fileWithSuffix(path.join(root, file), 'html'));
  if (update || (tex.length === 1 && html.length === 0)) {
    // 执行 pandoc 命令
    tex.forEach(file => {
      const absFile = path.join(root, file);
      const outFile = path.join(root, 'index.html')
      const command = `pandoc ${absFile} -s --webtex -o ${outFile}`;
      exec(command);
      console.log('exec pandoc')
    })
  }

  // 递归
  files.forEach(file => {
    const absFile = path.join(root, file);
    const stat = fs.lstatSync(absFile);
    if (stat.isDirectory()) {
      travel(absFile);
    }
  });
}

// 从 mathematics 目录开始，递归所有目录，
// 如果目录中包含 tex 类型的文件，执行 pandoc 命令将其转换为 html 文件。
travel(mathematics);
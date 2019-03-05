const { existsSync, readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const themes = require('./theme_origin.json');

const cwd = process.cwd();

const themePath = resolve(cwd, 'theme.json');

if (existsSync(themePath)) {
  try {
    const content = readFileSync(themePath, 'utf-8');
    if (content) {
      const customThemes = JSON.parse(content);
      if (customThemes && typeof customThemes === 'object') {
        const finialThemes = {
          ...themes,
          ...customThemes,
        }
        // 拼接字符串
        let string = `const theme = {\n`;
        Object.keys(finialThemes).forEach(key => {
          string += ` '${key}': '${finialThemes[key]}',\n`;
        });
        string += `};\n\nexport default theme;\n`;
        // 写入文件
        writeFileSync(resolve(__dirname, './theme.ts'), string);
        console.log('写入自定义主题成功');
      }
    }
  } catch (e) {
    console.log('读取/写入自定义主题失败:', e);
  }
}

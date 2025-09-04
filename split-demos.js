const fs = require('fs');
const path = require('path');

// 1. 读取原始 data.ts 文件内容
const dataFile = path.join(__dirname, 'src/assets/data/data.ts');
const demosDir = path.join(__dirname, 'src/assets/data/demos');

if (!fs.existsSync(demosDir)) {
    fs.mkdirSync(demosDir, { recursive: true });
}

const content = fs.readFileSync(dataFile, 'utf-8');

// 2. 提取 ALL_DEMO 数组内容
const match = content.match(/export const ALL_DEMO\s*=\s*\[(.*)\];/s);
if (!match) {
    console.error('ALL_DEMO 数组未找到！');
    process.exit(1);
}

const arrStr = `[${match[1]}]`;

// 3. 用 Function 解析（需保证 ALL_DEMO 里没有特殊依赖/变量）
let demos;
try {
    demos = Function('"use strict";return (' + arrStr + ')')();
} catch (e) {
    console.error('解析 ALL_DEMO 失败，请检查格式！', e);
    process.exit(1);
}

// 4. 依次写入 demoN.ts 文件
demos.forEach((demo, idx) => {
    const file = path.join(demosDir, `demo${idx + 1}.ts`);
    const code = `const demo${idx + 1} = ${JSON.stringify(demo, null, 2)};\nexport default demo${idx + 1};\n`;
    fs.writeFileSync(file, code, 'utf-8');
    console.log(`已生成: ${file}`);
});

console.log('全部拆分完成！');



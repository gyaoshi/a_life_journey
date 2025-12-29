const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // 处理根路径，重定向到enhanced-game.html
    let filePath = req.url === '/' ? '/enhanced-game.html' : req.url;
    
    // 移除查询参数
    filePath = filePath.split('?')[0];
    
    // 构建完整文件路径
    const fullPath = path.join(__dirname, filePath);
    
    console.log(`尝试读取文件: ${fullPath}`);
    
    // 获取文件扩展名
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // 读取文件
    fs.readFile(fullPath, (err, content) => {
        if (err) {
            console.error(`文件读取错误: ${err.message}`);
            if (err.code === 'ENOENT') {
                // 文件不存在
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <html>
                        <head><meta charset="UTF-8"></head>
                        <body style="background: #1a1a2e; color: white; font-family: Arial; text-align: center; padding: 50px;">
                            <h1>404 - 文件未找到</h1>
                            <p>请求的文件 ${filePath} 不存在</p>
                            <p>完整路径: ${fullPath}</p>
                            <a href="/" style="color: #4ecdc4;">返回首页</a>
                        </body>
                    </html>
                `);
            } else {
                // 服务器错误
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <html>
                        <head><meta charset="UTF-8"></head>
                        <body style="background: #1a1a2e; color: white; font-family: Arial; text-align: center; padding: 50px;">
                            <h1>500 - 服务器错误</h1>
                            <p>错误: ${err.message}</p>
                            <p>错误代码: ${err.code}</p>
                        </body>
                    </html>
                `);
            }
        } else {
            // 成功返回文件
            console.log(`成功读取文件: ${fullPath}, 大小: ${content.length} 字节`);
            res.writeHead(200, { 
                'Content-Type': contentType + '; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
        }
    });
});

server.listen(port, () => {
    console.log(`🎮 人生旅程游戏服务器启动成功！`);
    console.log(`🌐 访问地址: http://localhost:${port}`);
    console.log(`📱 游戏页面: http://localhost:${port}/enhanced-game.html`);
    console.log(`🔧 测试页面: http://localhost:${port}/test-server.html`);
    console.log(`\n按 Ctrl+C 停止服务器`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});
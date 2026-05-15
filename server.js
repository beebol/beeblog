const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    
    // 处理 /uploads/* 静态文件
    if (parsedUrl.pathname.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, 'public', parsedUrl.pathname)
      const fs = require('fs')
      
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath)
        const contentTypes = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
        }
        res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream')
        fs.createReadStream(filePath).pipe(res)
        return
      }
    }
    
    handle(req, res, parsedUrl)
  }).listen(3000, '0.0.0.0', (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})

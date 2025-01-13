const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { setupGracefulShutdown } = require('./lib/graceful-shutdown')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  server.listen(process.env.PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${process.env.PORT}`)
    process.send('ready')
  })

  setupGracefulShutdown(server)
})

process.on('SIGINT', () => {
  console.log('Received SIGINT. Graceful shutdown initiated.')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Graceful shutdown initiated.')
  process.exit(0)
})


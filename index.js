const Server = require('./src/Server')

async function main () {
  try {
    const server = new Server()
    await server.start()
  } catch (err) {
    console.log(err, 'Not able to start server')
    process.exit(1)
  }
}

main()

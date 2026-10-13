const fs = require('fs')
const path = require('path')

const outputDirectory = path.join(__dirname, 'www')

function clean() {
  fs.rmSync(outputDirectory, { recursive: true, force: true })
  fs.mkdirSync(outputDirectory)
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true })

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name)
    const destinationPath = path.join(destination, entry.name)

    if (entry.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(sourcePath), destinationPath)
    } else if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath)
    } else {
      fs.copyFileSync(sourcePath, destinationPath)
    }
  }
}

if (process.argv[2] === '--clean') {
  clean()
} else {
  copyDirectory(path.join(__dirname, 'public'), path.join(outputDirectory, 'public'))

  for (const file of ['config.js', 'contacts.js', 'server.js', 'package.json']) {
    fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file))
  }
}

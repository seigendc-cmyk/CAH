const sharp = require('sharp');
const path = require('path');

sharp({
  create: {
    width: 200,
    height: 200,
    channels: 3,
    background: { r: 255, g: 0, b: 0 }
  }
})
.jpeg()
.toFile(path.join(__dirname, 'test2.jpg'))
.then(() => console.log('Valid dummy JPG generated.'));

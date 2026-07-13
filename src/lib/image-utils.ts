import sharp from "sharp";

export async function processHeroSlideImage(buffer: Buffer) {
  return sharp(buffer)
    .rotate()
    .resize(1897, 1049, { fit: "cover", position: "centre" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}

export async function processStoryImage(buffer: Buffer) {
  return sharp(buffer)
    .rotate()
    .resize(980, 650, { fit: "cover", position: "centre" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}

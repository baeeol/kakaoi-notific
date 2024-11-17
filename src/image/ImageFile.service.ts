import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export type DirNameType = `${string}-${string}-${string}-${string}-${string}`;

class ImageFileService {
  async saveImageInRandomDir(imageUrlArray: string[]): Promise<DirNameType> {
    const dirName = crypto.randomUUID();
    const dirPath = `public/image/${dirName}`;
    fs.mkdirSync(dirPath);

    const saveImagePromiseArray = imageUrlArray.map(
      async (imageUrl: string, idx: number) => {
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const imageArrayBuffer = await imageBlob.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);

        fs.writeFileSync(`${dirPath}/${idx + 1}.png`, imageBuffer);
      }
    );

    await Promise.all(saveImagePromiseArray);

    return dirName;
  }

  getAllImageUrl(dirName: string): string[] {
    const dirPath = `public/image/${dirName}`;
    const fileArray = fs.readdirSync(`${dirPath}`);
    const fileNameArray = fileArray.filter((file: string) =>
      fs.statSync(path.join(dirPath, file)).isFile()
    );

    return fileNameArray.map((fileName: string) => {
      return `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}/image/${dirName}/${fileName}`;
    });
  }

  getImageUrl(dirName: string, fileName: string) {
    return `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}/image/${dirName}/${fileName}`;
  }
}

export default ImageFileService;

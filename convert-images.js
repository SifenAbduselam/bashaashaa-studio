import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./src/assets/images/gallery";

async function convert(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {

    const fullPath = path.join(dir, file);

    // Skip folders (if you have any)
    if (fs.statSync(fullPath).isDirectory()) {
      await convert(fullPath);
      continue;
    }


    // Convert only jpg, jpeg, png
    if (/\.(jpg|jpeg|png)$/i.test(file)) {

      const output = fullPath.replace(
        /\.(jpg|jpeg|png)$/i,
        ".webp"
      );


      await sharp(fullPath)
        .webp({
          quality: 85,
        })
        .toFile(output);


      console.log(`✔ Converted: ${file} → ${path.basename(output)}`);

    }

  }
}


convert(inputDir)
  .then(() => {
    console.log("🎉 Gallery conversion completed!");
  })
  .catch((error) => {
    console.error("❌ Conversion failed:", error);
  });
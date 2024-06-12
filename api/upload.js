const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const multiparty = require("multiparty");

const UPLOAD_DIR = "/tmp/uploads";
const OUTPUT_DIR = "/tmp/output";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

module.exports = (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "File parsing error" });
    }

    const file = files.file[0];
    const stemOption = fields.stem_option[0];
    const filePath = path.join(UPLOAD_DIR, file.originalFilename);

    fs.renameSync(file.path, filePath);

    const outputPath = path.join(OUTPUT_DIR, path.basename(filePath, path.extname(filePath)));

    exec(`spleeter separate -p spleeter:${stemOption} -o ${OUTPUT_DIR} ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ success: false, message: "Separation error" });
      }

      const stems = fs.readdirSync(outputPath).map((stem) => ({
        name: stem,
        url: `/api/output?file=${path.join(outputPath, stem)}`,
      }));

      res.status(200).json({ success: true, stems });
    });
  });
};

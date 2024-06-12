# stem-splitter

 Here is the complete implementation including the div to display the output:

### Directory Structure
```
/my-spleeter-app
  /api
    upload.js
    output.js
  /public
    index.html
    style.css
  vercel.json
  package.json
```

### Step-by-Step Implementation

#### 1. **File Upload Form and Stem Options (Frontend)**

Create `index.html` in the `public` directory:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audio Stem Separator</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://unpkg.com/wavesurfer.js"></script>
</head>
<body>
    <h1>Audio Stem Separator</h1>
    <form id="upload-form" enctype="multipart/form-data">
        <label for="file">Upload Audio File:</label>
        <input type="file" id="file" name="file" required><br><br>
        
        <label for="stem-option">Select Stem Option:</label>
        <select id="stem-option" name="stem_option" required>
            <option value="2stems">2 Stems</option>
            <option value="4stems">4 Stems</option>
            <option value="5stems">5 Stems</option>
        </select><br><br>
        
        <button type="submit">Upload and Separate</button>
    </form>
    <div id="result"></div>
    <div id="waveform"></div>
    <div id="output"></div>

    <script>
        document.getElementById('upload-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            const resultDiv = document.getElementById('result');
            const outputDiv = document.getElementById('output');

            if (result.success) {
                resultDiv.innerHTML = '<h2>Download Stems:</h2>';
                outputDiv.innerHTML = '<h2>Output:</h2>';

                result.stems.forEach(stem => {
                    const link = document.createElement('a');
                    link.href = stem.url;
                    link.textContent = stem.name;
                    link.download = stem.name;
                    link.onclick = (e) => {
                        e.preventDefault();
                        const wavesurfer = WaveSurfer.create({
                            container: '#waveform',
                            waveColor: 'violet',
                            progressColor: 'purple'
                        });
                        wavesurfer.load(stem.url);
                    };

                    const outputLink = document.createElement('a');
                    outputLink.href = stem.url;
                    outputLink.textContent = stem.name;
                    outputLink.download = stem.name;

                    resultDiv.appendChild(link);
                    resultDiv.appendChild(document.createElement('br'));
                    outputDiv.appendChild(outputLink);
                    outputDiv.appendChild(document.createElement('br'));
                });
            } else {
                alert('Error: ' + result.message);
            }
        };
    </script>
</body>
</html>
```

Create `style.css` in the `public` directory:

```css
body {
    font-family: Arial, sans-serif;
    margin: 20px;
}

form {
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
}

#result a, #output a {
    display: block;
    margin: 5px 0;
}

#waveform {
    margin-top: 20px;
}

#output {
    margin-top: 20px;
}
```

#### 2. **Node.js Backend with File Upload and Spleeter Processing**

Create `upload.js` in the `api` directory:

```javascript
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const multiparty = require('multiparty');

const UPLOAD_DIR = '/tmp/uploads';
const OUTPUT_DIR = '/tmp/output';

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
            return res.status(500).json({ success: false, message: 'File parsing error' });
        }

        const file = files.file[0];
        const stemOption = fields.stem_option[0];
        const filePath = path.join(UPLOAD_DIR, file.originalFilename);

        fs.renameSync(file.path, filePath);

        const outputPath = path.join(OUTPUT_DIR, path.basename(filePath, path.extname(filePath)));

        exec(`spleeter separate -p spleeter:${stemOption} -o ${OUTPUT_DIR} ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ success: false, message: 'Separation error' });
            }

            const stems = fs.readdirSync(outputPath).map(stem => ({
                name: stem,
                url: `/api/output?file=${path.join(outputPath, stem)}`
            }));

            res.status(200).json({ success: true, stems });
        });
    });
};
```

Create `output.js` in the `api` directory:

```javascript
const path = require('path');

module.exports = (req, res) => {
    const filePath = req.query.file;
    res.download(filePath, err => {
        if (err) {
            res.status(500).send('File not found.');
        }
    });
};
```

#### 3. **Vercel Configuration**

Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/index.html"
    }
  ]
}
```

#### 4. **Package.json**

Create `package.json` in the root directory:

```json
{
  "name": "my-spleeter-app",
  "version": "1.0.0",
  "main": "api/upload.js",
  "dependencies": {
    "multiparty": "^4.2.2"
  },
  "scripts": {
    "start": "node api/upload.js"
  }
}
```

### Deployment Instructions

1. Ensure you have [Vercel CLI](https://vercel.com/docs/cli) installed.
2. From the root directory of your project, run `vercel` to deploy the application.
3. Follow the prompts to set up and deploy your project.

### Next Steps

**a.** Add unit tests for backend functionality using a testing framework like Jest.  
**b.** Implement error handling and logging for better debugging and maintenance.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React and Chakra UI.

- Vite
- React
- Chakra UI

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/stem-splitter.git
cd stem-splitter
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

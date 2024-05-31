import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'
import { ensureDirectoryExists, __dirname, deleteTempDir } from './utils/utils.js'
import { config } from './config/config.js'

const imgToPdf = (param) =>{
  console.log('Converting png or jpg files to PDF book');
  
  ensureDirectoryExists(`../${config.out_dir}`)
  ensureDirectoryExists(`../${param}`)

  const pdfFilePath = `${config.out_dir}/${config.out_file}`;
  const pngDir = `${param}/`; 
  
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(pdfFilePath);
  doc.pipe(writeStream);
  
  // Generate PDF document
  fs.readdir(pngDir, (err, files) => {
    if (err) {
      return console.error(`Could not read the directory: ${err.message}`);
    }
  
    const imageFiles = files.filter(file => ['.png', '.jpg'].includes(path.extname(file).toLowerCase()));
  
    imageFiles.forEach((imageFile, index) => {
      if (index > 0) {
        doc.addPage();
      }
  
      doc.image(path.join(pngDir, imageFile), config.image);
    });
  
    doc.end();
  });
  
  writeStream.on('finish', () => {
    console.log(`PDF file created: ${pdfFilePath}`);
    deleteTempDir()
  });
  
}

export { imgToPdf }
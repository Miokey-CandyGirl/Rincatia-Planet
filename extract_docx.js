const AdmZip = require('adm-zip');
const path = require('path');

const docxPath = path.join(__dirname, 'consultation', '现代琳凯蒂亚语 v26.5.docx');
const zip = new AdmZip(docxPath);

// Extract document.xml which contains the main content
const documentXml = zip.readAsText('word/document.xml');

// Simple XML text extraction - strip tags
const text = documentXml
  .replace(/<w:p[^>]*>/g, '\n')  // paragraph start
  .replace(/<w:br[^>]*\/>/g, '\n')  // line break
  .replace(/<w:tab[^>]*\/>/g, '\t')  // tab
  .replace(/<[^>]+>/g, '')  // remove all other tags
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&#x/g, '&#x')  // keep hex entities for now
  .replace(/\n\s*\n/g, '\n')  // remove empty lines
  .trim();

// Write to a text file for reading
const fs = require('fs');
const outPath = path.join(__dirname, 'consultation', 'document_text.txt');
fs.writeFileSync(outPath, text, 'utf-8');
console.log('Text extracted to:', outPath);
console.log('--- First 5000 chars ---');
console.log(text.substring(0, 5000));
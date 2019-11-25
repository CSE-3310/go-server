const PDFJS = require("pdfjs-dist");
const compose = require("./compose");

const getPDFText = async (source) => {
  let pageText = "";

  const pdf = await PDFJS.getDocument(source).promise;
  const page = await pdf.getPage(1);
  const tokenizedText = await page.getTextContent();
  pageText = tokenizedText.items.map(token => token.str).join("");

  return pageText;
};

const renderPDF = async (filename) => {
  let raw = await getPDFText(filename);

  let keys = compose(raw);

  return {
    filename: filename,
    raw: raw,
    keywords: keys
  };
};

module.exports = renderPDF;

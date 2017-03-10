var Plugin = require('broccoli-plugin');
var FSTree = require('fs-tree-diff'); // eslint-disable-line no-unused-vars
var heimdall = require('heimdalljs'); // eslint-disable-line no-unused-vars
var _logger = require('heimdalljs-logger');

const logger = _logger('broccoli-glow'); // eslint-disable-line no-unused-vars

var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();

module.exports = class BroccoliGlow extends Plugin {
  constructor(node, options = {}) {
    super([node], {
      name: options.name,
      annotation: options.annotation,
      persistentOutput: true
    });

    // Save references to options you may need later
  }

  build() {
    glowSplitter(this.inputPaths[0], this.outputPath);
  }
}

function glowSplitter(inputDir, outputDir) {
  var fs = require('fs');
  var path = require('path');
  var files = fs.readdirSync(inputDir);

  for (var i in files) {
    if (path.extname(files[i]) !== ".md") { continue; }

    var inputPath = path.join(inputDir, files[i]);

    var parsed = md.parse(fs.readFileSync(inputPath, 'utf8'));

    var blocks = parsed.filter(token => token.type === "fence" && token.tag === "code");
    var jsBlocks = blocks.filter(token => token.info === "js" || token.info === "ts");
    var hbsBlocks = blocks.filter(token => token.info === "hbs");

    if (jsBlocks.length > 1) { throw new Error("Only one code block supported at the moment."); }
    if (hbsBlocks.length > 1) { throw new Error("Only one code block supported at the moment."); }

    writeComponent(outputDir, jsBlocks[0]);
    writeTemplate(outputDir, hbsBlocks[0]);
  }
}

function writeComponent(outputDir, block) {
  var fs = require('fs');
  var path = require('path');
  var outputPath = path.join(outputDir, `component.${block.info}`);

  fs.writeFileSync(outputPath, block.content);
}

function writeTemplate(outputDir, block) {
  var fs = require('fs');
  var path = require('path');
  var outputPath = path.join(outputDir, 'template.hbs');

  fs.writeFileSync(outputPath, block.content);
}
// https://saxonica.plan.io/issues/5021
const SaxonJS = require('saxon-js');
const path = require('path');
const fs = require('fs-extra');
const url = require('url');

(async () => {
    const stylesheetPath = path.resolve('stylesheet.sef.json');
    const stylesheet = (await fs.readJSON(stylesheetPath));

    const documentPath = path.resolve('Documents', 'Document.htm');
    const documentLocation = url.pathToFileURL(documentPath).toString();
    const documentText = (await fs.readFile(documentPath)).toString();

    const stylesheetParams = {};
    const resolvedDoc = await SaxonJS.getResource({ text: documentText, type: 'xml' });
    // TODO: Try removing "_saxonBaseUri" and "_saxonDocUri"
    resolvedDoc['_saxonBaseUri'] = documentLocation;
    resolvedDoc['_saxonDocUri'] = documentLocation;

    stylesheetParams['Q{}resolved-doc'] = resolvedDoc;

    const sourcePath = path.resolve('MasterPages', 'MasterPage.htm');
    const sourceLocation = url.pathToFileURL(sourcePath).toString();
    const sourceText = (await fs.readFile(sourcePath)).toString();

    try {
        const tranformation = await SaxonJS.transform({
            stylesheetInternal: stylesheet,
            sourceText: sourceText,
            // TODO: Try removing "sourceLocation"
            sourceLocation: sourceLocation,
            destination: 'serialized',
            stylesheetParams: stylesheetParams
        }, 'async');
        console.log(tranformation.principalResult);
    } catch (e) {
        console.log(e);
    }
})();
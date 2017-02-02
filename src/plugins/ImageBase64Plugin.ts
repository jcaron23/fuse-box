import { File } from "../File";
import { WorkFlowContext } from "./../WorkflowContext";
import { Plugin } from "../WorkflowContext";
import * as path from 'path';
import { SVG2Base64 } from '../lib/SVG2Base64';
const base64Img = require("base64-img");
/**
 * 
 * 
 * @export
 * @class FuseBoxHTMLPlugin
 * @implements {Plugin}
 */
export class ImageBase64PluginClass implements Plugin {
    /**
     * 
     * 
     * @type {RegExp}
     * @memberOf FuseBoxHTMLPlugin
     */
    public test: RegExp = /\.(gif|png|jpg|jpeg|svg)$/i;
    /**
     * 
     * 
     * @param {WorkFlowContext} context
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public init(context: WorkFlowContext) {
        context.allowExtension(".gif");
        context.allowExtension(".png");
        context.allowExtension(".jpg");
        context.allowExtension(".jpeg");
        context.allowExtension(".svg");
    }
    /**
     * 
     * 
     * @param {File} file
     * 
     * @memberOf FuseBoxHTMLPlugin
     */
    public transform(file: File) {


        const context = file.context;
        const cached = context.cache.getStaticCache(file);
        if (cached) {
            file.isLoaded = true;
            file.contents = cached.contents;
        } else {
            const ext = path.extname(file.absPath);
            if (ext === ".svg") {
                file.loadContents();
                let content = SVG2Base64.get(file.contents);
                file.contents = `module.exports = ${JSON.stringify(content)}`;
                return;
            }
            file.isLoaded = true;
            const data = base64Img.base64Sync(file.absPath);
            file.contents = `module.exports = ${JSON.stringify(data)}`;
            context.cache.writeStaticCache(file, undefined);
        }
    }
};

export const ImageBase64Plugin = (opts?: any) => {
    return new ImageBase64PluginClass();
}

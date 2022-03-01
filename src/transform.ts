/**
 * @file transform function
 * @author Sheeta(wuhayao@gmail.com)
 */

import {parseRequest} from './query';
import {compile} from './markdown';
import {PluginOptions} from './index';

export function createTransform(options: PluginOptions) {

    return function (id: string, raw: string) {
        const {filepath, query} = parseRequest(id);
        const realOptions = Object.assign({
            export: 'component'
        }, options, query);

        switch (realOptions.export) {
            case 'html':
                const {html} = compile(raw, {
                    filepath,
                    exportType: 'html'
                });
                return {
                    transformed: `export default \`${html}\``
                };
            case 'component':
                let {
                    entryComponent: transformed,
                    previewBlocks: attachment
                } = compile(raw, {
                    filepath,
                    exportType: 'component',
                    template: realOptions.template
                });
                return {
                    transformed: transformed || '',
                    attachment
                };
            case 'raw':
            default:
                return {
                    transformed: `export default \`${raw}\``
                };
        }
    };
};

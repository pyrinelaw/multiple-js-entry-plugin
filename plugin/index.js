'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const glob = require('glob');
/**
 * 初始转换 entry 入口
 */
const initConvertEntry = function() {
    if ((typeof this.entry == 'string') || (this.entry instanceof Array)) {
        this.entry = {
            main: this.entry,
        }
    }
}

const splitDirPathByFile = (file) => {
    const list = file.split('/');
    list.pop();
    return list;
}

const DEFAULT_OPTIONS = {
    src: path.join(__dirname, '../src'),
    split: '-',
    level: 0,
    entryFiles: '*/**/index.js',
    filter: () => (true),
    format: function(file) {
        const list = splitDirPathByFile(file);
        return list.join(this.split);
    },
}

class MultipleJsEntryPlugin {
    constructor(options = {}) {
        this.options = Object.assign(DEFAULT_OPTIONS, options, {});
        this.checkOptions();
    }

    checkOptions() {
        const options = this.options || {};

        assert(options.src, 'multiple-js-entry-plugin error: Options.dest must set');
        assert(options.split, 'multiple-js-entry-plugin error: Options.split must');
        if (!(/.+\..+$/.test(options.entryFiles))) {
            assert(null, 'multiple-js-entry-plugin error: Options.entryFiles must be match file, e.g: */**/index.js');
        }
        if (!_.isFunction(options.filter)) {
            assert(null, 'multiple-js-entry-plugin error: options.filter must is function!');
        }
        if (!_.isFunction(options.format)) {
            assert(null, 'multiple-js-entry-plugin error: Options.format must is function!');
        }
    }

    apply(compiler) {
        initConvertEntry.call(compiler.options);

        const options = this.options || {};
        const src = options.src;
        const level = options.level;
        const filter = options.filter;
        const entry = compiler.options.entry || {};

        const files = glob.sync('*/**/index.js', {cwd: src});
        
        files.forEach(file => {
            if (!options.filter(file)) return;
            
            const name = options.format(file);
            const dirPathList = splitDirPathByFile(file);

            if (name) {
                if (entry[name]) {
                    console.warn(`multiple-js-entry-plugin warning: The options.format must return string value!`);
                } else if (((level == 0) || (dirPathList.length <= level)) && filter(file)) {
                    entry[name] = path.join(src, file);
                }
            } else {
                console.warn(`multiple-js-entry-plugin warning: options. The entry name “${name}” is exists! Ignored!`);
            }
        });

        // Compile 开始进入编译环境，开始编译
        // Compilation 即将产生第一个版本
        // make任务开始
        // optimize作为Compilation的回调方法，优化编译，在Compilation回调函数中可以为每一个新的编译绑定回调。
        // after-compile编译完成
        // emit准备生成文件，开始释放生成的资源，最后一次添加资源到资源集合的机会
        // after-emit文件生成之后，编译器释放资源
    }
}

module.exports = MultipleJsEntryPlugin;
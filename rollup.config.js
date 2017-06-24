import resolve from 'rollup-plugin-node-resolve';

// Add here external dependencies that actually you use.
const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/add/operator/map': 'Rx',
    'rxjs/Subject': 'Rx'
};

export default {
    entry: './dist/modules/lizard-angular-sdk.es5.js',
    dest: './dist/bundles/lizard-angular-sdk.umd.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'ng.lizardAngularSDK',
    plugins: [resolve()],
    external: Object.keys(globals),
    globals: globals,
    onwarn: () => { return }
}

//    依赖
//    "eslint-plugin-html": "^3.2.1",
//     "eslint-plugin-testcafe": "^0.2.0",
//     "eslint-plugin-vue": "latest",
//      "babel-eslint": "^7.2.3",
module.exports = {
    "root": true,
    "plugins": ["vue", "testcafe", "html"],
    "parser": "babel-eslint",
    "env": {
        browser: true,
        es6: true
    },
    "rules": {
        'no-unused-vars': [1, { 'vars': 'all', 'args': 'none' }],
        'prefer-const': 0,
        "indent": [2, 4, {"SwitchCase": 1}],
        "no-const-assign": 2,
        "import/no-unresolved": 0,
        "import/no-unassigned-import": 0
    },
    "globals": {
        "axios": true,
        "ENV": true,
        "VERSION": true
    }
}

import globals from "globals";
import pluginJs from "@eslint/js";
// import jsdocRecommended from "eslint-plugin-jsdoc/lib/configs/recommended";
import jsdoc from "eslint-plugin-jsdoc";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,

    jsdoc.configs["flat/recommended"],
    // ...jsdocRecommended,
    {
        // extends: ["plugin:jsdoc/recommended"],
        plugins: {
            jsdoc,
        },
        rules: {
            "no-unused-vars": "warn",
            "jsdoc/require-description": "off",
            "jsdoc/require-jsdoc": "error", // Wymagamy JSDoc dla funkcji, metod, klas i funkcji strzałkowych
            "jsdoc/check-param-names": "warn", // Sprawdzamy, czy nazwy parametrów w JSDoc zgadzają się z nazwami w kodzie
            "jsdoc/check-tag-names": "warn", // Sprawdzamy, czy używamy poprawnych tagów JSDoc
            "jsdoc/check-types": "warn", // Sprawdzamy, czy typy w JSDoc są zgodne z typami w kodzie
        },
    },
];

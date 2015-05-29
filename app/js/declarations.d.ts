/* Declare types for plugins and libraries that are not found on
 * definitely typed
 */

// The add to homescreen button
declare module "homescreen" {
    var fn: () => void;
    export = fn;
}

// JQuery plugin
interface JQueryStatic {
    html5Loader: (any) => void;
}

// iOS has a `standalone` property on window.navigator
interface Navigator {
  standalone: boolean
}

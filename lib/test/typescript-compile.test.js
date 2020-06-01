"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
describe("Test for typescript compiler", function () {
    it("should compile valid typescript", function () {
        var source = "let x: string  = 'string'";
        var result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2015 } });
        console.log(JSON.stringify(result));
    });
});

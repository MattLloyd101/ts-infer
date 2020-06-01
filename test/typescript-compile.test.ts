import * as ts from "typescript";

describe("Test for typescript compiler", () => {

    it('should build a fn from AST', () => {
        function makeFactorialFunction() {
            const functionName = ts.createIdentifier("factorial");
            const paramName = ts.createIdentifier("n");
            const parameter = ts.createParameter(
                /*decorators*/ undefined,
                /*modifiers*/ undefined,
                /*dotDotDotToken*/ undefined,
                paramName
            );

            const condition = ts.createBinary(paramName, ts.SyntaxKind.LessThanEqualsToken, ts.createLiteral(1));
            const ifBody = ts.createBlock([ts.createReturn(ts.createLiteral(1))], /*multiline*/ true);

            const decrementedArg = ts.createBinary(paramName, ts.SyntaxKind.MinusToken, ts.createLiteral(1));
            const recurse = ts.createBinary(paramName, ts.SyntaxKind.AsteriskToken, ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg]));
            const statements = [ts.createIf(condition, ifBody), ts.createReturn(recurse)];

            return ts.createFunctionDeclaration(
                /*decorators*/ undefined,
                /*modifiers*/ [ts.createToken(ts.SyntaxKind.ExportKeyword)],
                /*asteriskToken*/ undefined,
                functionName,
                /*typeParameters*/ undefined,
                [parameter],
                /*returnType*/ ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                ts.createBlock(statements, /*multiline*/ true)
            );
        }

        const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

        const result = printer.printNode(ts.EmitHint.Unspecified, makeFactorialFunction(), resultFile);
        console.log(result);
    })

    it("should compile valid typescript", () => {
        const source = "export const x = function () { return 2; }";

        const sourceFile: ts.SourceFile = ts.createSourceFile("test.ts", source, ts.ScriptTarget.ES5);
        const compilerOptions: ts.CompilerOptions = {};
        function isNodeExported(node: ts.Node): boolean {
            return (
                (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
                (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
            );
        }
        const host: ts.CompilerHost = {
            writeFile(fileName: string, data: string, writeByteOrderMark: boolean, onError: ((message: string) => void) | undefined, sourceFiles: readonly ts.SourceFile[] | undefined): void {
            },
            fileExists(fileName: string): boolean {
                return true;
            },
            getCanonicalFileName(fileName: string): string {
                return fileName;
            },
            getCurrentDirectory(): string {
                return "";
            },
            getDefaultLibFileName(options: ts.CompilerOptions): string {
                return "";
            },
            getNewLine(): string {
                return "";
            },
            getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): ts.SourceFile {
                return sourceFile;
            },
            readFile(fileName: string): string | undefined {
                return source;
            },
            useCaseSensitiveFileNames(): boolean {
                return false;
            }

        };
        const program = ts.createProgram(["entrypoint"], compilerOptions, host);
        // let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2015 }});

        const typeChecker = program.getTypeChecker();

        function visit(node: ts.Node) {
            const type = typeChecker.getTypeAtLocation(node);
            console.log('->', typeChecker.typeToString(type));
            // console.log(isNodeExported(node));

            ts.forEachChild(node, visit);
            // typeChecker.getSymbolAtLocation(node.name);
        }
        ts.forEachChild(sourceFile, visit);
    });

});
import * as ts from "typescript";

interface Constraint {

}
interface TType<T> extends Constraint {
}
interface TNumber extends TType<Number> {

}
interface TApp<T extends (...args: any) => any> extends TType<T> {
    args: ConstrainableValue<any>[];
    returnType: ConstrainableValue<ReturnType<T>>;
}
class ConstrainableValueProxyHandler<T> implements ProxyHandler<ConstrainableValue<T>> {
    private readonly target: ConstrainableValue<T>;
    constructor(target: ConstrainableValue<T>) {
        this.target = target;
    }

    apply<T extends (...args: any) => any>(target: ConstrainableValue<T>, thisArg: any, argArray?: any): ConstrainableValue<ReturnType<T>> {
        const fn = new ConstrainableFunction<T>();
        fn.addArguments(argArray);
        this.target.addConstraint(fn);

        return fn.returnType;
    }

    getPrototypeOf(target: ConstrainableValue<T>) {
        return Object.getPrototypeOf(this.target);
    }

    setPrototypeOf(_: ConstrainableValue<T>, prototype: any) {
        return Object.setPrototypeOf(this.target, prototype);
    }

    isExtensible(_: ConstrainableValue<T>) {
        return Object.isExtensible(this.target);
    }

    preventExtensions(_: ConstrainableValue<T>) {
        return !!Object.preventExtensions(this.target);
    }

    getOwnPropertyDescriptor(_: ConstrainableValue<T>, prop: PropertyKey) {
        return Object.getOwnPropertyDescriptor(this.target, prop);
    }

    defineProperty(_: ConstrainableValue<T>, key: PropertyKey, descriptor: PropertyDescriptor) {
        return Object.defineProperty(this.target, key, descriptor);
    }

    has (_: ConstrainableValue<T>, key: PropertyKey) {
        return key in this.target;
    }

    get(_: ConstrainableValue<T>, prop: PropertyKey, receiver: any) {
        // @ts-ignore
        return this.target[prop];
    }

    set(_: ConstrainableValue<T>, prop: PropertyKey, value: any) {
        // @ts-ignore
        return this.target[prop] = value;
    }

    deleteProperty(_: ConstrainableValue<T>, prop:PropertyKey) {
        // @ts-ignore
        return delete this.target[prop];
    }

    ownKeys (_: ConstrainableValue<T>) {
        return Reflect.ownKeys(this.target);
    }
}

class ConstrainableValue<T> {
    protected readonly proxyHandler: ConstrainableValueProxyHandler<T>;
    protected readonly proxy: ConstrainableValue<T>
    private constraints: Constraint[];

    constructor() {
        this.proxyHandler = new ConstrainableValueProxyHandler(this);
        this.proxy = new Proxy(this, this.proxyHandler);
        this.constraints = [];
    }

    addConstraint(constraint: Constraint): ConstrainableValue<T> {
        this.constraints.push(constraint);
        return this;
    }

    toEqual(value: any): ConstrainableValue<T> {
        return this;
    }

    toHaveSideEffect(sideEffect: Constraint) {
        return this.addConstraint(sideEffect);
    }

}

class ConstrainableFunction<T extends (...args: any) => any> extends ConstrainableValue<T> {
    argTypes: ConstrainableValue<any>[];
    returnType: ConstrainableValue<ReturnType<T>> = new ConstrainableValue<ReturnType<T>>();

    constructor() {
        super();
        this.argTypes = [];
    }

    toReturn(value: any): ConstrainableValue<ReturnType<T>> {
        return null as unknown as ConstrainableValue<ReturnType<T>>;
    }

    addArguments(argArray: any) {
        // @ts-ignore
        this.argTypes = argArray.map(_ => new ConstrainableValue());
    }
}
class FunctionSpecification<T extends (...args: any) => any> {
    readonly value: ConstrainableFunction<T> = new ConstrainableFunction<T>();

    scenario(title: string, specification: (fn: (...value: Parameters<T>) => ConstrainableValue<ReturnType<T>>) => void) {
        console.log(specification.toString());
        doInsaneThings(specification.toString());
        specification(this.value['proxy'] as unknown as T);
    }
}
class Module {
    moduleName: string;
    constructor(moduleName: string) {
        this.moduleName = moduleName;
    }

    defineFunction<T extends (...args: any) => any>(ident: string, body: (implementation: FunctionSpecification<T>) => void) {
        const base = new FunctionSpecification<T>();
        body(base);
    }

    defineConstant<T>(ident: string, body: (implementation: ConstrainableValue<T>) => void) {

    }
}

export function defineModule(moduleName: string, body: (module: Module) => void) {

    body(new Module(moduleName));
}

function doInsaneThings(source: string) {
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
}
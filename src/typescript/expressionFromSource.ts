import {createSourceFile, ScriptTarget, SourceFile, Node, Expression, forEachChild, isNumericLiteral, isExpressionStatement} from "typescript";

export function expressionFromSource(source: string): Expression {
    const sourceFile: SourceFile = createSourceFile('ignore', source, ScriptTarget.ES5);

    const expression = sourceFile.getChildAt(0).getChildAt(0);
    if(isExpressionStatement(expression)) {
        return expression.expression;
    }

    throw new Error('not implemented');
}
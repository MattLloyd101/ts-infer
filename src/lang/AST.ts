import { Type } from "./Types";
import { Constraint } from "./Constraints";

type Ident = string;

interface Term {
    constraints: Constraint[];
}

interface Expression extends Term {
    type: Type;
}

type BlockLine = Expression | Statement;

interface NumberLiteral extends Expression {
}

interface StringLiteral extends Expression {
}

interface BooleanLiteral extends Expression {
}

interface FieldAccessor extends Expression {
    target: Expression;
    field: Ident;
}
interface Identifier extends Expression {
    name: Ident;
}
interface FunctionArgument extends Term {
    name: Ident;
    type: Type;
}
interface LambdaFunction extends Expression {
    arguments: FunctionArgument[];
    body: Expression;
}
interface Function extends Expression {
    arguments: FunctionArgument[];
    name: Ident;
    body: Block;
}

interface Application extends Expression {
    name: Ident;
    arguments: Expression[];
}

interface Statement extends Term {

}
interface Block extends Statement {
    expressions: BlockLine[];
}

interface ConstantDeclaration extends Statement {
    name: Ident;
    expression: Expression;
}
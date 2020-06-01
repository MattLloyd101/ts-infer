import {expressionFromSource} from "../../src/typescript/expressionFromSource";
import {SyntaxKind, isNumericLiteral, isStringLiteral, isCallExpression, isIdentifier} from "typescript";

describe('expressionFromSource', () => {

    it('should return a NumericLiteral for simple numbers', () => {
        const actual = expressionFromSource('42');
        expect(actual.kind).toEqual(SyntaxKind.NumericLiteral);
        expect(isNumericLiteral(actual)).toBeTruthy();
    });

    it('should return a NumericLiteral for decimal numbers', () => {
        const actual = expressionFromSource('3.14');
        expect(actual.kind).toEqual(SyntaxKind.NumericLiteral);
        expect(isNumericLiteral(actual)).toBeTruthy();
    });

    it('should return a StringLiteral for double quoted strings', () => {
        const actual = expressionFromSource('"test"');
        expect(actual.kind).toEqual(SyntaxKind.StringLiteral);
        expect(isStringLiteral(actual)).toBeTruthy();
    });

    it('should return a StringLiteral for single quoted strings', () => {
        const actual = expressionFromSource("'test'");
        expect(actual.kind).toEqual(SyntaxKind.StringLiteral);
        expect(isStringLiteral(actual)).toBeTruthy();
    });

    it('should return a TrueKeyword for true', () => {
        const actual = expressionFromSource('true');
        expect(actual.kind).toEqual(SyntaxKind.TrueKeyword);
    });

    it('should return a FalseKeyword for false', () => {
        const actual = expressionFromSource('false');
        expect(actual.kind).toEqual(SyntaxKind.FalseKeyword);
    });

    it('should return a CallExpression for fn()', () => {
        const actual = expressionFromSource('fn()');
        expect(actual.kind).toEqual(SyntaxKind.CallExpression);
        expect(isCallExpression(actual)).toBeTruthy();
    });

    it('should return a Identifier for a', () => {
        const actual = expressionFromSource('a');
        expect(actual.kind).toEqual(SyntaxKind.Identifier);
        expect(isIdentifier(actual)).toBeTruthy();
    });
});
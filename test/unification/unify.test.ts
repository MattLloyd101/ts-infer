import FreeVar from "../../src/unification/FreeVar";
import unify, {SubstitutionMap, UnifyableValue} from "../../src/unification/unify";
import {expressionFromSource} from "../../src/typescript/expressionFromSource";

describe('unify', () => {
    let emptySubstitutionsMap: SubstitutionMap;

    const simpleExpressions = [
        expressionFromSource('42'),
        expressionFromSource('3.14'),
        expressionFromSource('"test"'),
        expressionFromSource('true'),
        expressionFromSource('false'),
        expressionFromSource('a'),
    ];

    beforeEach(() => {
        emptySubstitutionsMap = new Map<UnifyableValue, UnifyableValue>();
    });

    test.each(simpleExpressions)
    ('Unifies simple expressions with FreeVars and adds a new substitution', (u) => {
        const v = new FreeVar();

        const actual = unify(u, v, emptySubstitutionsMap);
        expect(actual.isRight()).toBeTruthy();
        const map = (actual.__value as SubstitutionMap);
        expect(map.has(v)).toBeTruthy();
        expect(map.get(v)).toEqual(u);
    });

    test.each(simpleExpressions)
    ('is commutative', (u) => {
        const v = new FreeVar();

        expect(unify(u, v, emptySubstitutionsMap))
            .toEqual(unify(v, u, emptySubstitutionsMap))
    });

    test.each(simpleExpressions)
    ('returns the set of substitutions if the values are equal', (u) => {
        const actual = unify(u, u, emptySubstitutionsMap);
        expect(actual.isRight()).toBeTruthy();
        expect(actual.__value).toEqual(emptySubstitutionsMap);
    });
});
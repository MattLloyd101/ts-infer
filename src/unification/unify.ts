import FreeVar, {FREE_VAR_KIND} from "./FreeVar";
import { Expression } from "typescript";
import {Either, Left, Right} from "purify-ts";

export type UnifyableValue = Expression | FreeVar;
export type SubstitutionMap = Map<UnifyableValue, UnifyableValue>;

function isVar(x: UnifyableValue): x is FreeVar {
    return x.kind === FREE_VAR_KIND;
}

function substitute(u: FreeVar, v: UnifyableValue, substitutions: Map<UnifyableValue, UnifyableValue>): SubstitutionMap {
    const newSubs = new Map<UnifyableValue, UnifyableValue>(substitutions.entries());

    newSubs.set(u, v);
    return newSubs;
}

export default function unify(u: UnifyableValue, v: UnifyableValue, substitutions: SubstitutionMap): Either<string, SubstitutionMap> {

    if(u === v) {
        return Right(substitutions);
    }
    if(isVar(u)) {
        return Right(substitute(u, v, substitutions));
    }
    if(isVar(v)) {
        return Right(substitute(v, u, substitutions));
    }

    return Left("Not implemented yet");
}
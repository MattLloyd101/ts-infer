import FreeVar, { FREE_VAR_KIND } from "../../src/unification/FreeVar";

describe("FreeVar", () => {

    afterEach(() => {
      FreeVar.resetCounter();
    });

    it('can reset the counter for id incrementing', () => {
        expect(FreeVar.getNextId()).toEqual(0);
        expect(FreeVar.getNextId()).toEqual(1);
        FreeVar.resetCounter();
        expect(FreeVar.getNextId()).toEqual(0);
        expect(FreeVar.getNextId()).toEqual(1);
    });

    it('has an auto incrementing id', () => {
        expect(new FreeVar().id).toEqual(0);
        expect(new FreeVar().id).toEqual(1);
        expect(new FreeVar().id).toEqual(2);

        expect(FreeVar.getNextId()).toEqual(3);
    });

    it('renders as an anonymous variable', () => {
        expect(new FreeVar().toString()).toEqual('_0');
        expect(new FreeVar().toString()).toEqual('_1');
        expect(`${new FreeVar()}`).toEqual('_2');
    });

    it('has a runtime kind tag of FREE_VAR_KIND', () => {
        expect(new FreeVar().kind).toEqual(FREE_VAR_KIND);
    })
})
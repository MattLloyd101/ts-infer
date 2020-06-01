import {defineModule} from "../../src/testInterface/TestInterface";

describe("TestInterface", () => {
    it("does stuff", () => {
        defineModule("index", index => {
            index.defineConstant<number>("x", (x) => {
                x.toEqual(42);
            });

            index.defineFunction<(n: number) => number>("main", (main) => {

                main.scenario("4 + 1 = 5", (main) => {
                    main(4).toEqual(5);
                    // Apply(main, [4]) ->
                });
            });
        });
    })
})
import {defineModule} from "../../../src/testInterface/TestInterface";

defineModule("index", (index) => {

    index.defineFunction<(n: number) => number>("main", (main) => {

        main.scenario("4 + 1 = 5", (main) => {
            main(4)
                .toEqual(5)
                .toHaveSideEffect(log("hello world"));
        });
    });

});
## Repo for reproducing a problem with [InversifyJS](https://github.com/inversify/InversifyJS) default values.

To reproduce:
1. `npm start`
2. Open http://localhost:1234/ in browser.
3. Open dev console to observe what is going on.

Expected:
- both `ComponentWithDefault` and `ComponentWithoutDefault` should get the same config object injected into the constuctor, because they are identified by the same `identifier`.

Actual:
- `ComponentWithDefault` ignores bindings set up in the container and the optional parameter always has the default value.

Extra info:
- Inversify determines the number of parameters it has to inject into a function by using [`Function.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length) - see [source code](https://github.com/inversify/InversifyJS/blob/89ecfd7cf8270ec77ea4a896d5519c6ab92d8161/src/planning/reflection_utils.ts#L37).
- `Function.length` "excludes the rest parameter and only includes parameters before the first one with a default value". So it returns `2` for `ComponentWithoutDefault`'s constructor and `1` for `ComponentWithDefault`'s constructor. This works as expected.
- However, as a result, Inversify only injects 1 parameter into `ComponentWithDefault`. Because of that the 2nd parameter value is never different from default.
- One more thing is that metadata seems to not be added to optional constructor parameters. (Possibly, that's why Inversify cannot recognize what kind of dependency it is.)
import "reflect-metadata";
import { Container, inject, injectable, optional } from 'inversify';

export type Constructor<T = {}> = new (...args: any[]) => T;

type ComponentConfig = {
    someAttribute: 'option 1' | 'option 2';
}

@injectable()
class Dependency {

}

@injectable()
class ComponentWithDefault {
    constructor(
        public dependency: Dependency,
        @inject('identifier') @optional() public config: ComponentConfig = { someAttribute: 'option 2' }) {
    }
}

@injectable()
class ComponentWithoutDefault {
    constructor(
        public dependency: Dependency,
        @inject('identifier') @optional() public config: ComponentConfig) {
    }
}

const container = new Container({ skipBaseClassChecks: true });
container.bind(ComponentWithDefault).toSelf();
container.bind(ComponentWithoutDefault).toSelf();
container.bind(Dependency).toSelf();

const childContainer = new Container({ skipBaseClassChecks: true });
childContainer.parent = container;
childContainer.bind('identifier').toConstantValue(<ComponentConfig>{
    someAttribute: 'option 1'
});

console.log('with default', childContainer.get(ComponentWithDefault).config);
console.log('without default', childContainer.get(ComponentWithoutDefault).config);

console.log(ComponentWithDefault.length);
console.log(ComponentWithoutDefault.length);

function printMetadata(target: Constructor) {
    console.log('Metadata of: ', target.name)
    for (const metadataKey of Reflect.getMetadataKeys(target)) {
        console.log('\t', metadataKey, Reflect.getMetadata(metadataKey, target));
    }
}

printMetadata(ComponentWithDefault);
printMetadata(ComponentWithoutDefault);
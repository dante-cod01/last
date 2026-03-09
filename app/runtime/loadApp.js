import { loader } from "./loadComponent.js"

const importTest = async () => {
    const componentName = "reactive_box"
    await loader(componentName)
}

importTest()
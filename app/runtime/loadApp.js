import { loader } from "./loadComponent.js"

const importTest = async () => {
/*     const module = await import("../../components/_micro/boxes/reactive_box.js")
 */    const module = await import("../../components/_micro/boxes/reactive_box.js")
/*     const test = document.createElement(module.tag)
 */    const deps = [
        "base"
    ]

    loader(deps)
}

importTest()
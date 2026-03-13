import { componentsList } from "../../conf/componentsList.js"
import { dependenciesList } from "../../conf/dependenciesList.js"

const components_reg = new Map()
const dependencies_reg = new Map()

const register = (reg, list, name) => {
    if (!list[name]) { console.error({ name }, `❌ not found in ${reg === components_reg ? "COMPONENTS" : "DEPENDENCIES"} list`); return }
    reg === components_reg
        ? !reg.get(name) && reg.set(name, { "url": list[name].url, "module": null, "depsBase": list[name].dependencies, "depsOptionals": [], "used": [] })
        : !reg.get(name) && reg.set(name, { "url": list[name].url, "module": null, "instance": null, "used": [] })
}

const importMods = async (reg, list, name) => {
    !reg.get(name).module && (reg.get(name).module = await import(list[name].url))
}

const createInstance = (dep) => {
    const regDep = dependencies_reg.get(dep)
    !regDep.instance && (regDep.instance = new regDep.module.default())
    return regDep.instance
}

export const loader = async (name, box) => {
    /* registers */
    register(components_reg, componentsList, name)
    componentsList[name].dependencies.forEach(dep => register(dependencies_reg, dependenciesList, dep))
    /* import modules */
    const promises = []
    promises.push(importMods(components_reg, componentsList, name))
    componentsList[name].dependencies.forEach(dep => promises.push(importMods(dependencies_reg, dependenciesList, dep)))
    await Promise.all(promises)
    /* create dependencies instances */
    const deps = componentsList[name].dependencies
    const instances = {}
    deps.forEach(dep => instances[dep] = createInstance(dep))
    /* create component */
    const component = document.createElement(name)
    box.appendChild(component)
    /* apply conf */
    Object.keys(instances).length && (component.deps = instances)
    console.log(component.deps)

}
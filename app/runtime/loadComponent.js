import { componentsList } from "../../conf/componentsList.js"
import { dependenciesList } from "../../conf/dependenciesList.js"

const components_reg = new Map()
const dependencies_reg = new Map()

const register = (name) => {
    const info = componentsList[name] || null

    if (!info) { console.error([name], "not found in components list"); return }
    if (!components_reg.get(name)) components_reg.set(name, { "module": info.url, "dependencies": info.dependencies })
    if (info.dependencies) {
        for (const dep of info.dependencies) {
            !dependencies_reg.get(dep) && dependencies_reg.set(dep, { "module": dependenciesList.get(dep) })
        }
    }
    return components_reg.get(name)
}

const importModules = async (registerComp) => {
    const modules = {
        "component": null,
        "dependencies": null
    }
    const component_promise = import(registerComp.module).then(mod => {
        registerComp.module = mod
        modules.component = mod
    })


    let dependencies_promise = []
    if (registerComp.dependencies.length) {
        modules.dependencies = {}
        for (const item of registerComp.dependencies) {
            const dep = dependencies_reg.get(item)
            dependencies_promise.push(import(dep.module).then(mod => {
                dep.module = mod.default
                modules.dependencies[item] = mod
            }))
        }
    }
    await Promise.all([component_promise, ...dependencies_promise])
    return modules
}

const createInstances = (modules) => {
    const instances = {
        "component": null,
        "dependencies": {}
    }

    instances.component = new modules.component.default()
    if (modules.dependencies) Object.entries(modules.dependencies).forEach(([name, module]) => instances.dependencies[name] = new module.default())
}

export const loader = async (name) => {
    const componentInReg = register(name)
    const modules = componentInReg && await importModules(componentInReg)
    const instances = createInstances(modules)
}
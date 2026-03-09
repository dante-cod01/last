import { dependenciesList } from "../../conf/dependenciesList.js"

const componentsModules = new Map()
const dependenciesModules = new Map()

const registerModules = async (names, mode) => {
    let newRegs = {}
    let error = []
    const list = mode === "component" ? componentsList : dependenciesList
    const registry = mode === "component" ? componentsModules : dependenciesModules

    for (const name of names) {
        const module = list.get(name)
        !module && error.push([name], "module name not found")
    }

    if (error.length) {
        error.forEach(item => console.log([mode], item))
        return
    }

    names.forEach(name => {
        const module = list.get(name)
        registry.set(name, { "module": module })
        newRegs[name] = module
    })

    await instanceModules(newRegs, registry)
}

const instanceModules = async (newRegs, registry) => {
    const promises = []
    for (const [name, url] of Object.entries(newRegs)) {
        promises.push(import(url).then(moduleImported => {
            registry.set(name, {
                "module": moduleImported,
                "instance": new moduleImported.default()
            })
        }))
    }
    await Promise.all(promises)
}

export const loader = (modules) => {
    const dependencies = registerModules(modules, "dependencies")
}
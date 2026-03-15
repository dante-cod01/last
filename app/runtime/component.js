const mods = {}
const components_reg = new Map()
const dependencies_reg = new Map()

const imports = async () => {
    await Promise.all([
        import(`${window.route}/app/conf/componentsList.js`).then(mod => mods["componentsList"] = mod.componentsList),
        import(`${window.route}/app/conf/dependenciesList.js`).then(mod => mods["dependenciesList"] = mod.dependenciesList),
    ])
}

const register = (reg, list, name) => {
    if (!list[name]) { console.error(name, `❌ not found in ${reg === components_reg ? "COMPONENTS" : "DEPENDENCIES"} list`); return }
    reg === components_reg
        ? !reg.get(name) && reg.set(name, { "url": `${window.route}${list[name].url}`, "module": null, "depsBase": list[name].dependencies, "usedBy": [] })
        : !reg.get(name) && reg.set(name, { "url": `${window.route}${list[name].url}`, "module": null, "instance": null, "usedBy": [] })
    return reg.get(name)
}

const registerUse = (reg, component) => {
    reg.usedBy.push(component)
}

const importMods = async (register, list, name) => {
    const reg = register.get(name)
    if (!reg.module) {
        reg.module = "import waiting"
        try {
            const module = await import(`${window.route}${list[name].url}`)
            reg.module = module
        } catch (error) {
            console.error(name, "❌ imported fail")
            throw error
        }
    }
}

const createInstance = (dep) => {
    const regDep = dependencies_reg.get(dep)
    !regDep.instance && (regDep.instance = new regDep.module.default())
    return regDep.instance
}

export const loader = async (name, box, config) => {
    /* imports */
    !Object.keys(mods).length && await imports()

    /* registers */
    register(components_reg, mods.componentsList, name)
    mods.componentsList[name].dependencies.forEach(dep => register(dependencies_reg, mods.dependenciesList, dep))

    /* import modules */
    const deps = mods.componentsList[name].dependencies
    await Promise.all([importMods(components_reg, mods.componentsList, name), ...deps.map(dep => importMods(dependencies_reg, mods.dependenciesList, dep))])

    /* create dependencies instances */
    const instances = {}
    deps.forEach(dep => instances[dep] = createInstance(dep))

    /* create component & apply conf */
    const component = document.createElement(name)
    box.appendChild(component)
    component.id = config?.id || crypto.randomUUID()
    config?.css && (component.css = config.css)
    config?.logic && (component.logic = config.logic)
    config?.data && (component.data = config.data)
    config?.links && (component.links = config.links)
    if (Object.keys(instances).length) component.deps = instances

    /* register uses */
    registerUse(components_reg.get(name), component)
    deps.forEach(dep => registerUse((dependencies_reg.get(dep)), component))
    return component
}

export const updateDependencies = async (deps, component) => {
    /* imports */
    !Object.keys(mods).length && await imports()

    if (!Array.isArray(deps)) { console.error(deps, `❌ new dependencies must be array`); return }
    const promises = []
    for (const dep of deps) {
        const depAdded = register(dependencies_reg, mods.dependenciesList, dep)
        registerUse(dependencies_reg.get(dep), component)
        promises.push(importMods(dependencies_reg, mods.dependenciesList, dep))
    }
    await Promise.all(promises)
    deps.forEach(dep => {
        const instance = createInstance(dep)
        component.deps[dep] = instance
    })
}

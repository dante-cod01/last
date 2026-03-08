const importTest = async () => {
    const module = await import("./../../components/_micro/boxes/reactive_box.js")
    const test = document.createElement(module.tag)
    const deps = [
        "./../../components/deps/base.js",
        "./../../components/deps/base.js"
    ]

    /* al loader como # */
    const inyectedDeps = {}
    await Promise.all(
        deps.map(async dep => {
            const module = await import(dep)
            inyectedDeps[module.name] = new module.default()
        })
    )
    /*  */

    await test.addDeps(inyectedDeps)
    test.init()
    
    console.log(test.getInfo())
}

importTest()

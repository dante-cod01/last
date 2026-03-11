export default class base {
    /* RESOLVE EXTERNAL CONFIG */
    resolveCSS(css, defaultCSS, dom) {
        const resumed = { ...defaultCSS }
        if (css !== null) {
            Object.entries(css).forEach(([prop, value]) => {
                prop in resumed
                    ? typeof (value) === "string"
                        ? resumed[prop] = value
                        : console.error([dom], prop, `⚠️ Invalid value, will be used default: 🔄 ${resumed[prop]}`)
                    : console.error([dom], prop, `❌ Not valid prop - will not be used`)
            })
        }
        this.convertCssVar(resumed, dom)
        return resumed
    }

    resolveLOGIC(logic, defaultLOGIC, dom) {
        const resumed = {}
        Object.entries(defaultLOGIC).forEach(([prop, value]) => {
            resumed[prop] = value[0]
        })
        if (logic !== null) {
            Object.entries(logic).forEach(([prop, value]) => {
                prop in resumed
                    ? defaultLOGIC[prop].includes(value)
                        ? resumed[prop] = value
                        : console.error([dom], prop, `⚠️ Invalid value, will be used default 🔄 ${resumed[prop]}`)
                    : console.error([dom], prop, `❌ Not valid prop - will not be used`)
            })
        }
        return resumed
    }

    /* CSS PROPS*/
    convertCssVar(css, dom) {
        Object.entries(css).forEach(([prop, value]) => dom.style.setProperty(`--${prop}`, value))
    }

    /* COMPONENTS ELEMENTS */
    addStyle(dom) {
        const style = document.createElement("style")
        dom.appendChild(style)
        style.classList.add("componentStyle")
        style.textContent = `
            * {
                margin: 0px;
                padding: 0px;
                box-sizing: border-box;
                list-style: none;
            }
        `
        return style
    }
}
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

    /* DOM ELEMENTS */
    add(dom, tag, id = null, classNames = null) {
        const element = document.createElement(tag)
        id && (element.id = id)
        classNames && (element.classList = classNames)
        dom.appendChild(element)
        return element
    }

    addStyle(dom) {
        const style = this.add(dom, "style", "", "componentStyle")
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

    /* IMPORTS RESOURCES */
    addLinks(dom, links) {
        const addFont = (dom, font) => {
            const link = this.add(dom, "link")
            link.setAttribute("href", font.url)
            link.setAttribute("rel", "stylesheet")
            return link
        }

        links.forEach(item => {
            if (item.type === "font") {
                const previousImport = document.head.querySelector(`link[href="${item.url}"]`)
                if (item.material && !previousImport) addFont(document.head, item)
                const link = addFont(dom, item)
            }
        })
    }
}
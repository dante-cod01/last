export default class ComponentTest extends HTMLElement {
    /* PRIVATE PROPS */
    #requiredDeps = [
        "base"
    ]
    #CONF = {
        id: "test",
        eventName: "test",
        eventDom: "document",
        links: null,
        data: null
    }
    #CSS = {
        host_width: "200px",
        host_height: "200px",
        box_border: "1px solid rgba(179, 15, 15, 0.5)",
        box_borderRadius: "6px",
        box_background: "rgba(179, 15, 15, 0.2)",
        textBox_width: "30px",
        textBox_height: "30px",
        text_fontFamily: "initial",
        text_fontSize: "initial",
        text_fontWeight: "initial",
        text_fontStyle: "initial",
        text_color: "initial"

    }
    #LOGIC = {
        direction: ["hor", "ver"]
    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })

        /* PUBLIC PROPS */
        this.dom = this.shadowRoot
        this.deps = {}
        this.css = null
        this.logic = null
        this.data = null
        this.links = null
        this.prepared = null
        this.initialized = null
    }

    /* PRIVATE METHODS */
    #verifiqueDeps() {
        const depsStatus = { "_all": true }
        this.#requiredDeps.forEach(item => {
            depsStatus[item] = item in this.deps
            !depsStatus[item] && (depsStatus._all = false)
        })
        return depsStatus
    }

    #prepareConf() {
        this.css = this.deps.base.resolveCSS(this.css, this.#CSS, this)
        this.logic = this.deps.base.resolveLOGIC(this.logic, this.#LOGIC, this)
        this.deps.base.addLinks(this.dom, this.links)
    }

    #logicDirection() {
        const main = this.dom.querySelector(".main")
        this.logic.direction === "ver" && main.classList.add("ver")
    }

    #dataText() {
        const main = this.dom.querySelector(".main")
        if (this.data.text) {
            const text = this.data.text
            for (let i = 0; i < text.length; i++) {
                const box = this.deps.base.add(main, "div", "", text[i] === " " ? "charBox_space" : "charBox center")
                box.textContent = text[i]
            }
        }
    }

    #applyLogic() { this.#logicDirection() }
    #applyData() { this.#dataText() }

    #draw() {
        this.dom.innerHTML = `<div class="main" id="${this.#CONF.id}"></div>`
        const customStyle = this.deps.base.addStyle(this.dom)
        customStyle.textContent += `
            :host {
                display: flex;
                width: var(--host_width);
                height: var(--host_height);
            }

            .main {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                border: var(--box_border);
                border-radius: var(--box_borderRadius);
                background: var(--box_background);

                .charBox {
                    width: var(--textBox_width);
                    height: var(--textBox_height);
                    font-family: var(--text_fontFamily);
                    font-size: var(--text_fontSize);
                    font-weight: var(--text_fontWeight);
                    font-style: var(--text_fontStyle);
                    color: var(--text_color);
                }

                .charBox_space {
                    width: calc(var(--textBox_width) / 1.2);
                    height: calc(var(--textBox_height) / 1.2);
                }
            }

            .center {display: flex; justify-content: center; align-items: center;}
            .ver {flex-direction: column;}
        `
    }

    /* PUBLIC METHODS */
    addDepsInstances(name, instance) {
        console.log(this.deps)
        name in this.deps
            ? console.error([this], `dependency ${[name]} previously inyected`)
            : this.deps[name] = instance
    }

    getInfo() {
        return {
            "dependencies": this.#verifiqueDeps(),
            "info": { ...this.#CONF }
        }
    }

    updateConf(key, value) {
        if (key in this.#CONF) {
            this.#CONF[key] = value
        } else {
            console.error([this], [key], "not valid")
        }
    }

    /* LIFECYCLES */
    prepare() { 
        this.#prepareConf()
        this.prepared = true
    }

    init() {
        const deps = this.#verifiqueDeps()
        this.initialized && console.error([this], "already initialized")
        !deps._all && console.error([this], "not found dependencies", deps)
        if (this.initialized || !deps._all) return

        !this.prepared && this.prepare()
        this.#draw()
        this.#applyLogic()
        this.#applyData()
        this.initialized = true
    }
}
customElements.define("component-test", ComponentTest)
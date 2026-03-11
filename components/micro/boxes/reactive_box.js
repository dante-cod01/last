export default class ReactiveBox extends HTMLElement {
    /* private props */
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
    }
    #LOGIC = {
        direction: ["hor", "ver"]
    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })

        /* public props */
        this.deps = {}
        this.css = null
        this.logic = {direction: "vefr"}
    }

    /* private methods */
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
        console.log(this.logic)
    }

    #draw() {
        this.shadowRoot.innerHTML = `<div class="main" id="${this.#CONF.id}"></div>`
        const customStyle = this.deps.base.addStyle(this.shadowRoot)
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
            }

            .ver {flex-direction: column;}
        `
    }

    /* public methods */
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

    init() {
        this.#prepareConf()
        this.#draw()
    }
}
customElements.define("component-test", ReactiveBox)
export const tag = "component-test"
export default class ReactiveBox extends HTMLElement {
    /* private props */
    #def_conf = {
        id: "test",
        eventName: "test",
        eventDom: "document",
        links: null,
        data: null
    }
    #def_css = {

    }
    #def_logic = {

    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })

        /* public props */
    }

    /* private methods */
    #prepareConf(config) {
        config && (this.#def_conf = config) /* procesar y comprobar la conf */
    }

    #draw() {
        this.shadowRoot.innerHTML = `<div class="test" id=${this.#def_conf.id}></div>`
    }

    /* public methods */
    async addDeps(deps) {
        this.deps = deps
        this.deps.base.prepareConf()
    }

    getInfo() { return { ...this.#def_conf } }

    updateConf(key, value) {
        if (key in this.#def_conf) {
            this.#def_conf[key] = value
        } else {
            console.error([this], [key], "not valid")
        }

    }

    init(config = null) {
        const conf = this.#prepareConf(config || null)
        this.#draw()
    }
}
customElements.define(tag, ReactiveBox)
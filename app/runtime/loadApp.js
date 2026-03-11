import { loader } from "./loadComponent.js"

const importTest = async () => {
    const componentName = "reactive_box"
    const component = await loader(componentName, document.body)

    const css = {
        host_width: "400px",
        host_height: "400px",
        box_border: "1px solid rgba(0, 0, 0, 0.5)",
        box_borderRadius: "6px",
        box_background: "rgba(0, 0, 0, 0.2)",
    }

    component.css = css

    component.init()
}

importTest()
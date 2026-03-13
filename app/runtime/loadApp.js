import * as load from "./loadComponent.js"

const importTest = async () => {
    const componentName = "component-box"
    const component = await load.loader(componentName, document.body)

    const css = {
        host_width: "400px",
        host_height: "400px",
        box_border: "1px solid rgba(0, 0, 0, 0.5)",
        box_borderRadius: "6px",
        box_background: "rgba(0, 0, 0, 0.2)",
        textBox_width: "36px",
        textBox_height: "36px",
        text_fontFamily: "Permanent Marker",
        text_fontSize: "42px",
        text_fontWeight: "bolder",
        text_color: "rgb(28, 28, 28)"
    }
    const logic = {
        direction: "ver"
    }
    const data = {
        text: "Next Level"
    }
    const links = [
        { type: "font", material: true, name: "Permanent Marker", url: "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" }
    ]

    component.css = css
    component.logic = logic
    component.data = data
    component.links = links
/*     component.init()
 *//*     await load.updateDependencie(component, "life")
    component.deps.life.test()
 */}

importTest()
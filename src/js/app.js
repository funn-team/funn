/* ======================================================================
   src/js/app.js — OPPKOBLING
   Setter sammen model, view og controller. Endres sjelden — det daglige
   arbeidet skjer i model.js, view/screens/ og controller.js.
   ====================================================================== */

import { createController } from "./controller.js"
import { createModel } from "./model.js"
import { createView } from "./view.js"

const rot = document.getElementById("app")
if (!rot) throw new Error("Mangler #app i index.html")

const model = createModel()
const view = createView(rot)
const controller = createController({ model, view })

controller.init()

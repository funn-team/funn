/* ======================================================================
   src/js/app.js — WIRING
   Puts model, view and controller together. Rarely changes — the daily
   work happens in model.js, view/screens/ and controller.js.
   ====================================================================== */

import { createController } from "./controller.js";
import { createModel } from "./model.js";
import { createView } from "./view.js";

const root = document.getElementById("app");
if (!root) throw new Error("Missing #app in index.html");

const model = createModel();
const view = createView(root);
const controller = createController({ model, view });

controller.init();

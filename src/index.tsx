import React from "react";
import { render } from "ink";
import App from "./App.js";

const { waitUntilExit } = render(<App />, { alternateScreen: true });

const currentContext = await waitUntilExit();
if (typeof currentContext === "string") {
    console.log("Current context:", currentContext);
}

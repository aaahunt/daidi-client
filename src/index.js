import { createRoot } from "react-dom/client"

import Root from "./Root"

const root = createRoot(document.getElementById("root"))

root.render(<Root />)

if (import.meta.hot) {
  import.meta.hot.accept()
}

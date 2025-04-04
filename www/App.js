import { Router } from "../src/modules/Runtime.js";

export function App() {
    Router.route([
        {
            host: "www.adatage.com",
            path: "/",
            content: `<Layout />`,
            routes: [
                { path: "", content: `<Home />` },
                { path: "/news", content: `<News />` },
                { path: "*", content: `<Error404 />` }
            ]
        }
    ]);
    return { Router };
}
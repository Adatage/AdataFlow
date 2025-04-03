import { Router } from "../src/modules/Runtime.js";
import Layout from "./components/Layout.js";
import Home from "./components/Pages/Home.js";
import News from "./components/Pages/News.js";
import Error404 from "./components/Pages/Error404.js";

Router.route([
    {
        host: "www.adatage.com",
        path: "/",
        content: Layout,
        routes: [
            { path: "", content: Home },
            { path: "/news", content: News },
            { path: "*", content: Error404 }
        ]
    }
]);

function App() {
    
}

export { Router, App }
const msg = "Hello World";

export function App() {
    return (`
        <Router>
            <Route host="www.adatage.com" path="/" content="<Layout />">
                <Route path="" content="<Home />" />
                <Route path="/news">
            </Route>
        </Router>
    `);
}
(async () => {
    const app = await import("./www/App.js");
    const host = "www.adatage.com";
    const path = "/home";

    const prebuild = app.Router.handle(host, path);

    console.log(prebuild);
})();
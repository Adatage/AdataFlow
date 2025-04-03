(async () => {
    const app = await import("./www/App.js");
    const path = "/home";

    app.Router.handle(path);

    console.log(app);
})();
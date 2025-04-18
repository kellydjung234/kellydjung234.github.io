document.addEventListener("DOMContentLoaded", () => {
    let light_theme = localStorage.getItem("light_theme");
    const themeSwitch = document.getElementById("theme_switch");

    const enableLightTheme = () => {
        document.body.classList.add("light_theme");
        localStorage.setItem("light_theme", "active");
    };

    const disableLightTheme = () => {
        document.body.classList.remove("light_theme");
        localStorage.setItem("light_theme", null);
    };

    // Apply the theme on page load based on localStorage
    if (light_theme === "active") {
        enableLightTheme();
    }

    // Toggle theme on button click
    themeSwitch.addEventListener("click", () => {
        light_theme = localStorage.getItem("light_theme");

        // Track theme switch 
        gtag("event", "theme_switch", {
            event_category: "theme",
            event_label: light_theme === "active" ? "light_theme" : "dark_theme",
        });

        if (light_theme === "active") {
            disableLightTheme();
        } else {
            enableLightTheme();
        }
    });
});
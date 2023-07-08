"use strict";
//Change theme script

{
    /**
    @type {OnClickHandler<HTMLButtonElement>} */
    function changeTheme(e) {
        const button = e.currentTarget;
        const theme = (
            button.getAttribute("data-value") === "dark"
            ? "light"
            : "dark"
        );
        button.setAttribute("data-value", theme);
        localStorage.setItem("theme", theme);
        document.body.className = theme;
    }

    // Initialize theme
    const themeButton = document.getElementById("header_button-theme");

    if (themeButton !== null) {
        themeButton.onclick = changeTheme;

        /**
        @type {"dark" | "light"} */
        let theme = "light";
        const t = localStorage.getItem("theme");
        if (t !== null) {
            theme = t;
        } else {
            if (
                window.matchMedia !== undefined
                && window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                theme = "dark";
            } else {
                theme = "light";
            }
            localStorage.setItem("theme", theme);
        }
        themeButton.setAttribute("data-value", theme);
        document.body.className = theme;
    }
}

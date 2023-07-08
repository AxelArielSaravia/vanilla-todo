import {
    html_icon_add,
    html_icon_moon,
    html_icon_option,
    html_icon_sun
} from "./icons.html.js";

const html_header = `
<header>
    <button
        id="header_button-filter"
        class="header-button left"
        type="button"
        title="open filter"
    >
        ${html_icon_option}
    </button>
    <button
        id="header_button-add"
        class="header-button center"
        type="button"
        title="add a new todo"
    >
        ${html_icon_add}
    </button>
    <button
        id="header_button-theme"
        class="header-button right"
        type="button"
        title="dark"
        data-value="light"
    >
        ${html_icon_moon}
        ${html_icon_sun}
    </button>
</header>
`;

export default html_header;

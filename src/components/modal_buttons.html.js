import {html_icon_close} from "./icons.html.js";

/**
@type {(id: string) => string} */
function html_modal_button_close(id) {
    return`
<button
    id="${id}"
    class="button-close"
    type="button"
    title="close"
>
    ${html_icon_close}
</button>
`;
}

/**
@type {(
    text: string,
    id: maybe<string>,
) => string} */
function html_modal_button_complete(text, id) {
    return `
<div class="button-complete-parent">
    <button
        ${id !== undefined ? `id="${id}"` : ""}
        name="button_complete"
        class="button-complete"
        type="button"
        title="complete"
    >
        ${text}
    </button>
</div>
`;
}

export {
    html_modal_button_close,
    html_modal_button_complete
};

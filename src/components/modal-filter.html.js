import html_general_filter from "./general-filter.html.js";
import {html_modal_button_close} from "./modal_buttons.html.js";

const html_modal_filter = `
<div
    id="modal_filter"
    class="modal"
    data-display="0"
>
    <div>
        ${html_modal_button_close(
            /*id*/ "modal_filter-button-close"
        )}
        ${html_general_filter}
    </div>
</div>
`;

export default html_modal_filter;

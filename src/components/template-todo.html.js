import {html_icon_close} from "./icons.html.js";

const html_template_todo = `
<template id="template_todo">
    <div
        class="todo"
        id=""
        data-completed="0"
        data-display="0"
    >
        <div class="left">
            <div class="todo-header">
                <p class="date-text"></p>
                <button
                    class="todo-button edit"
                    type="button"
                    title="edit todo"
                    data-id=""
                >
                    <p class="edit">edit</p>
                </button>
                <button
                    class="todo-button remove"
                    type="button"
                    title="remove todo"
                    data-id=""
                >
                    ${html_icon_close}
                </button>
            </div>
            <div class="todo-main">
                <p></p>
            </div>
            <div class="todo-footer"></div>
        </div>
        <div class="right">
            <button
                class="todo-button"
                type="button"
                aria-label="toggle completed"
                title="mark as completed"
                data-id=""
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="icon icon-check-square"
                    viewBox="0 0 16 16"
                >
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path class="checked" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                </svg>
            </button>
        </div>
    </div>
</template>
`;

export default html_template_todo;

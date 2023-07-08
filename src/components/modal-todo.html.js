import {
    html_modal_button_close,
    html_modal_button_complete
} from "./modal_buttons.html.js";


const html_todo_date = `
<div class="container-date">
    <label class="radio">
        <input
            name="change_date"
            class="display-none"
            type="radio"
            value="0"
            checked
        />
        <p>No</p>
    </label>
    <label class="radio">
        <input
            name="change_date"
            class="display-none"
            type="radio"
            value="1"
        />
        <p>Yes</p>
    </label>
</div>
`;

const html_todo_color = `
<div class="container-color">
    <label class="item-color">
        <input
            class="visual-hidden"
            type="radio"
            value="default"
            name="color"
        />
        <div class="color default" title="default"></div>
    </label>
    <label class="item-color">
        <input
            class="visual-hidden"
            type="radio"
            value="blue"
            name="color"
        />
        <div class="color blue" title="blue"></div>
    </label>
    <label class="item-color">
        <input
            class="visual-hidden"
            type="radio"
            value="purple"
            name="color"
        />
        <div class="color purple" title="purple"></div>
    </label>
    <label class="item-color">
        <input
            class="visual-hidden"
            type="radio"
            value="pink"
            name="color"
        />
        <div class="color pink" title="pink"></div>
    </label>
    <label class="item-color">
        <input
            class="visual-hidden"
            type="radio"
            value="red"
            name="color"
        />
        <div class="color red" title="red"></div>
    </label>
    <label class="item-color">
        <input
            class="visual-hidden"
            type="radio"
            value="brown"
            name="color"
        />
        <div class="color brown" title="brown"></div>
    </label>
    <label class="item-color">
        <input
            class="visual-hidden"
            type="radio"
            value="yellow"
            name="color"
        />
        <div class="color yellow" title="yellow"></div>
    </label>
    <label class="item-color">
        <input
            class="visual-hidden"
            type="radio"
            value="green"
            name="color"
        />
        <div class="color green" title="green"></div>
    </label>
</div>
`;

const html_todo_tags = `
<div class="container-tags">
    <div
        id="modal_todo-input-tags"
        class="input-tags"
    >
        <input
            name="tags_input"
            type="text"
            placeholder="add a tag"
        />
        <fieldset
            name="tags_suggested"
            class="tags-suggested"
            data-display="0"
        >
        </fieldset>
    </div>
    <button
        name="tags_add"
        class="button-add"
        type="button"
    >
        <p>add</p>
    </button>
</div>
`;

const html_modal_todo = `
<form
    id="modal_todo"
    class="modal"
    data-display="0"
>
    <div class="modal-todo-root">
        ${html_modal_button_close(
            /*id*/ "modal_todo-button-close"
        )}
        <h3 id="modal_todo-title" class="modal-todo title"></h3>
        <section class="section modal-todo section-text">
            <h4>What do you need to do?</h4>
            <textarea
                name="text"
                title="todo text"
                rows="2"
                required
            >
            </textarea>
        </section>
        <section
            id="modal_todo-section-date"
            class="section modal-todo section-date"
            data-display="0"
        >
            <h4>Set date to now:</h4>
            ${html_todo_date}
        </section>
        <section
            class="section modal-todo section-color"
        >
            <h4>Select Color:</h4>
            ${html_todo_color}
        </section>
        <section class="section modal-todo section-tags">
            <h4>Tags:</h4>
            ${html_todo_tags}
        </section>
        <section
            class="section-tags-selected"
            data-display="0"
        >
            <p>Remove tags:</p>
            <fieldset
                name="tags_selected"
                class="container-tags-selected"
            >
            </fieldset>
        </section>
        ${html_modal_button_complete(
            /*text*/ "create",
            /**/ undefined,
        )}
    </div>
</form>
`;

export default html_modal_todo;

const html_filter_actions = `
<div class="container-actions">
    <button
        name="button_complete"
        type="button"
        class="button-action"
    >
        <p>Mark all as completed</p>
    </button>
    <button
        name="button_clear"
        type="button"
        class="button-action"
    >
        <p>Clear completed</p>
    </button>
</div>
`;

const html_filter_status = `
<div class="container-status">
    <label class="radio">
        <input
            class="visual-hidden"
            type="radio"
            value="all"
            name="status"
            checked
        />
        <p title="All">All</p>
    </label>
    <label class="radio">
        <input
            class="visual-hidden"
            type="radio"
            value="active"
            name="status"
        />
        <p title="Active">Active</p>
    </label>
    <label class="radio">
        <input
            class="visual-hidden"
            type="radio"
            value="completed"
            name="status"
        />
        <p title="Completed">Completed</p>
    </label>
</div>
`;

const html_filter_colors = `
<div class="container-color">
    <label class="item-color">
        <input
            name="color"
            class="color default"
            type="checkbox"
            value="default"
        />
    </label>
    <label class="item-color">
        <input
            name="color"
            class="color blue"
            type="checkbox"
            value="blue"
        />
    </label>
    <label class="item-color">
        <input
            name="color"
            class="color purple"
            type="checkbox"
            value="purple"
        />
    </label>
    <label class="item-color">
        <input
            name="color"
            class="color pink"
            type="checkbox"
            value="pink"
        />
    </label>
    <label class="item-color">
        <input
            name="color"
            class="color red"
            type="checkbox"
            value="red"
        />
    </label>
    <label class="item-color">
        <input
            name="color"
            class="color brown"
            type="checkbox"
            value="brown"
        />
    </label>
    <label class="item-color">
        <input
            name="color"
            class="color yellow"
            type="checkbox"
            value="yellow"
        />
    </label>
    <label class="item-color">
        <input
            name="color"
            class="color green"
            type="checkbox"
            value="green"
        />
    </label>
</div>
`;

const html_filter_tags = `
<div class="container-tags">
    <div
        id="general_filter-input-tags"
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
</div>
`;

const html_general_filter = `
<form id="general_filter">
    <section class="section filter">
        <h3>Actions</h3>
        ${html_filter_actions}
    </section>
    <section class="section filter">
        <h3>Filter by</h3>
        <section class="section filter-status">
            <h4>Status:</h4>
            ${html_filter_status}
        </section>
        <section class="section filter-color">
            <h4>Colors:</h4>
            ${html_filter_colors}
        </section>
        <section class="section filter-tags">
            <h4>Tags:</h4>
            ${html_filter_tags}
        </section>
        <section
            class="section tags-selected"
            data-display="0"
        >
            <p>Remove tags:</p>
            <fieldset
                name="tags_selected"
                class="container-tags-selected"
            >
            </fieldset>
        </section>
    </section>
</form>
`;

export default html_general_filter;

import {
    TodosState,
    TodosMethods,
    TagsMethods,
    DateTimeFormatter
} from "./state.js";
import {
    ModalTodoMethods,
    ModalTodoState,
    ModalTodoDOM,
    ModalTodoTagsState
} from "./modal-todo.js";

const DOMTemplateTodo = document.getElementById("template_todo");

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
/** @type {() => string }*/
function createId() {
    let id = Date.now().toString();
    for (let i = 0; i < 8; i += 1) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const position = Math.floor(Math.random() * id.length);
        if (position === id.length) {
            id = String.prototype.concat.call(id, char);
        } else if (position === 0) {
            id = String.prototype.concat.call(char, id);
        } else {
            id = String.prototype.concat.call(
                String.prototype.slice.call(id, 0, position),
                char,
                String.prototype.slice.call(id, position)
            );
        }
    }
    return id;
}

// Todo
/**
@type {OnClickHandler<HTMLButtonElement>} */
function toggleTodo(e) {
    const buttonToggle = e.currentTarget;
    const id = buttonToggle.getAttribute("data-id");
    if (id === null) {
        console.warn(
            "WARNNING: data-id does not exist in this button.",
            "We can not toggle the completition of the todo."
        );
        return;
    }
    TodosMethods.toggleCompleted(id);
}

/**
@type {OnClickHandler<HTMLButtonElement>} */
function removeTodo(e) {
    const id = e.currentTarget.getAttribute("data-id");
    if (id === null) {
        console.warn(
            "WARNNING: data-id does not exist in this button.",
            "We can not remove the todo."
        );
        return;
    }
    TodosMethods.remove(id);
}

/**
@type {OnClickHandler<HTMLButtonElement>} */
function completeEdit(e) {
    if (ModalTodoDOM.text.value.length === 0) {
        //we can not create a new todo
        //if it has no text
        return;
    }
    const id = ModalTodoState.editId;
    TodosMethods.edit(
        /*id*/ id,
        /*changeDate*/ ModalTodoDOM.changeDate.value === "1",
        /*text*/ ModalTodoDOM.text.value,
        /*color*/ ModalTodoDOM.color.value,
        /*tags*/ ModalTodoTagsState.selected
    );
    ModalTodoMethods.closeTodoModal();
}

/**
@type {OnClickHandler<HTMLButtonElement>} */
function openEdit(e) {
    const id = e.currentTarget.getAttribute("data-id");
    if (id === null) {
        return;
    }
    ModalTodoState.editId = id;
    const todo = TodosState.todos[id];

    ModalTodoMethods.initTagsEdit(todo.tags);

    ModalTodoDOM.title.textContent = ModalTodoState.EDIT_TITLE;

    ModalTodoDOM.sectionDate.setAttribute("data-display", "1");
    ModalTodoDOM.changeDate.value = "0";

    ModalTodoDOM.text.value = todo.text;
    ModalTodoDOM.color.value = todo.color;

    //TODO CREATE COMPLETE BUTTON
    ModalTodoDOM.buttonComplete.textContent = "edit";
    ModalTodoDOM.buttonComplete.onclick = completeEdit;

    ModalTodoMethods.openTodoModal();
}

/**
@type {(
    id: string,
    text: string,
    date: number,
    tags: ref<Array<string>>,
    color?: Colors,
    completed?: boolean,
) => DOMTodo} */
function createDOMTodo(
    id,
    text,
    date,
    tags,
    color = "default",
    completed = false
) {
    const fragment = DOMTemplateTodo.content.cloneNode(true);
    const DOMTodo = fragment.firstElementChild;
    DOMTodo.id = id;
    DOMTodo.setAttribute("data-color", color);

    if (completed) {
        DOMTodo.setAttribute("data-completed", "1");
    }

    const left = DOMTodo.firstElementChild;
    const right = DOMTodo.lastElementChild;

    //left
    const header = left.children[0];
    const main = left.children[1];
    const footer = left.children[2];

    const leftDate = header.children[0];
    const buttonEdit = header.children[1];
    const buttonRemove = header.children[2];
    leftDate.textContent = DateTimeFormatter.format(date);
    buttonEdit.setAttribute("data-id", id);
    buttonRemove.setAttribute("data-id", id);
    buttonEdit.onclick = openEdit;
    buttonRemove.onclick = removeTodo;

    main.firstElementChild.textContent = text;

    DOMTodo.header = header;
    DOMTodo.main = main;
    DOMTodo.footer = footer;

    if (tags.length > 0) {
        footer.setAttribute("data-display", "1");
        for (let i = 0; i < tags.length; i += 1) {
            const DOMTodoTag = TagsMethods.createDOMTodoTag(tags[i]);
            footer.appendChild(DOMTodoTag);
        }
    }

    //right
    const buttonToggle = right.firstElementChild;
    buttonToggle.setAttribute("data-id", id);
    buttonToggle.onclick  = toggleTodo;

    DOMTodo.buttonToggle = buttonToggle;

    return DOMTodo;
}

/**
@type {(
    text: string,
    color: Colors,
    tags: ref<Array<string>>
) => undefined} */
function createTodo(text, color, tags) {
    const id = createId();
    const date = Date.now();
    const newTodo = {
        color,
        completed: false,
        date,
        id,
        tags: Array.from(tags),
        text
    };
    const DOMTodo = createDOMTodo(
        /*id*/ id,
        /*text*/ text,
        /*date*/ date,
        /*tags*/ tags,
        /*color*/ color
    );
    TodosMethods.add(id, newTodo, DOMTodo);
}

export {
    createTodo,
    createDOMTodo
}

import {
    ModalTodoMethods,
    ModalTodoDOM,
    ModalTodoState
} from "./modal-todo.js";
import {createTodo} from "./tempate-todo.js";

/**
@type {OnClickHandler<HTMLButtonElement>} */
function completeCreateTodo() {
    if (ModalTodoDOM.text.value.length === 0) {
        //we can not create a new todo
        //if it has no text
        return;
    }
    createTodo(
        /*text*/ ModalTodoDOM.text.value,
        /*color*/ ModalTodoDOM.color.value,
        /*tags*/ ModalTodoState.tagsSelected
    );
    ModalTodoMethods.closeTodoModal();
}

/**
@type {OnClickHandler<HTMLButtonElement>} */
function addButtonOnClick() {
    ModalTodoMethods.resetTags();


    ModalTodoDOM.title.textContent = ModalTodoState.CREATE_TITLE;

    ModalTodoDOM.text.value = "";
    ModalTodoDOM.color.value = "default";
    ModalTodoDOM.sectionDate.setAttribute("data-display", "0");

    ModalTodoDOM.buttonComplete.textContent = "create";
    ModalTodoDOM.buttonComplete.onclick = completeCreateTodo;

    ModalTodoMethods.openTodoModal();
}

{ //Initializations

    const headerButtonAdd = document.getElementById("header_button-add");
    if (headerButtonAdd === null) {
        throw Error("header_button-add is null");
    } else {
        headerButtonAdd.addEventListener("click", addButtonOnClick);
    }
}

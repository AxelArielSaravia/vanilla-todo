import "./scripts/match-media.js";
import "./scripts/state.js";
import {
    TodosState,
    TodosDOM,
    TagsMethods,
    TodosMethods
} from "./scripts/state.js";
import {createDOMTodo} from "./scripts/tempate-todo.js";
import "./scripts/modal-todo.js";
import "./scripts/modal-init.js";
import "./scripts/filter.js";
import "./scripts/header_theme.js";
import "./scripts/header_add.js";

{//Init Todos Ids
    const storageIds = localStorage.getItem("todo.ids");
    if (storageIds !== null) {
        if (storageIds.length > 2) {
            //throw an error in bad json schemma
            try {
                TodosState.ids = JSON.parse(localStorage["todo.ids"]);
            } catch {
                // if there is a error assume that everything
                // in localstorage is wrong
                const theme = localStorage.getItem("theme");
                localStorage.clear();
                localStorage.setItem("todo.ids", "[]");
                if (theme !== null) {
                    localStorage.setItem("theme", theme);
                }
            }

        }
    } else {
        localStorage.setItem("todo.ids", "[]");
    }
}
{// Init Todos
    let tr = -1;
    const end = TodosState.ids.length;
    let id = "";
    for (let i = 0; i < end; i += 1) {
        id = TodosState.ids[i];
        const jsonTodo = localStorage.getItem(`todo.${id}`);
        if (jsonTodo !== null) {
                let todo;
            try {
                todo = JSON.parse(jsonTodo);
            } catch {
                localStorage.removeItem(`todo.${id}`);
                if (tr === -1) {
                    tr = i;
                }
                continue;
            }
            TodosState.todos[id] = todo;
            const DOMTodo = createDOMTodo(
                /*id*/ id,
                /*text*/ todo.text,
                /*date*/ todo.date,
                /*tags*/ todo.tags,
                /*color*/ todo.color,
                /*complete*/ todo.complete
            );

            //If exist a client filter state we neet to change this !!!!!
            DOMTodo.setAttribute("data-display", "1");
            if (todo.completed) {
                TodosMethods.setDOMTodoComplete(DOMTodo, true);
            }

            TodosDOM.todos[id] = DOMTodo;
            TodosDOM.fragment.appendChild(DOMTodo);
            TodosState.selected.push(id);

            if (tr !== -1) {
                TodosState.ids[tr] = TodosState.ids[i];
                tr += 1;
            }
        } else {
            if (tr === -1) {
                tr = i;
            }
        }
    }
    Element.prototype.append.apply(
        TodosDOM.root,
        TodosDOM.fragment.children
    );
    if (tr !== -1) {
        TodosState.ids.length = tr;
    }
}
{// Init TagsState
    let id = "";
    for (let i = 0; i < TodosState.ids.length; i += 1) {
        id = TodosState.ids[i];
        const todo = TodosState.todos[id];
        TagsMethods.add(todo.tags);
    }
}

//PWA
if (navigator.serviceWorker !== undefined) {
    navigator.serviceWorker.register("serviceworker.js");
}

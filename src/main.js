import "./scripts/state.js";
import {
    TodosState,
    TodosDOM,
    TagsMethods,
    TodosMethods,
    FilterMethods
} from "./scripts/state.js";

import {createDOMTodo} from "./scripts/tempate-todo.js";

import {
    ModalTodoDOM,
    ModalTodoTagsState,
    ModalTodoMethods
} from "./scripts/modal-todo.js";

import {
    FilterDOM,
    FilterDOMMethods,
    FilterTagsState
} from "./scripts/filter.js";

const MATCH_MIN_WIDTH_780 = window.matchMedia("(min-width: 780px)");

{ //MatchMedia
    MATCH_MIN_WIDTH_780.addEventListener(
        "change",
        FilterDOMMethods.onMatchMedia
    );
    if (MATCH_MIN_WIDTH_780.matches) {
        FilterDOMMethods.onMatchMedia(MATCH_MIN_WIDTH_780);
    }
}
{// Modal Inititil Message
    /**
    @type {() => undefined} */
    function closeInitModal() {
        document.getElementById("modal_init")?.remove();
    }

    /**
    @type {(this: GlobalEventHandlers, ev: MouseEvent) => any} */
    function completeInit() {
        localStorage.setItem("show-init", "false");
        document.getElementById("modal_init")?.remove();
    }

    const show = localStorage.getItem("show-init");
    if (show !== "false") {
        const closeButton = document.getElementById("modal_init-button-close");
        const completeButton = (
            document.getElementById("modal_init-button-complete")
        );
        if (closeButton !== null && completeButton !== null) {
            closeButton.onclick = closeInitModal;
            completeButton.onclick = completeInit;
        }
        if (show === undefined) {
            localStorage.setItem("show-init", "true");
        }
    } else {
        document.getElementById("modal_init")?.remove();
    }
}

{//Init Todos Ids from localStorage
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
{//Header change theme
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
{//Header create Button

    const headerButtonAdd = document.getElementById("header_button-create");
    if (headerButtonAdd === null) {
        throw Error("header_button-create is null");
    } else {
        headerButtonAdd.addEventListener("click", ModalTodoMethods.openCreate);
    }
}
{// Main (Todos Container)
    /**
    @type {(target: EventTarget) => string | null} */
    function getButtom(target) {
        let id = target.getAttribute("data-id");
        while (id === null && target !== TodosDOM.root) {
            target = target.parentElement;
            id = target.getAttribute("data-id");
        }
        return id;
    }
    TodosDOM.root.addEventListener("click", function (e) {
        const target = e.target;
        if (target === null) {
            return;
        }
        if (target.getAttribute("data-match") === "completed"
        || target.matches("[data-match=completed] *")
        ) {
            let id = getButtom(target);
            if (id === null) {
                console.warn("There is something wrong in buttom completed");
                return;
            }
            TodosMethods.toggleCompleted(id);
        } else if (target.getAttribute("data-match") === "edit"
        || target.matches("[data-match=edit] *")
        ) {
            let id = getButtom(target);
            if (id === null) {
                console.warn("There is something wrong in buttom edit");
                return;
            }
            ModalTodoMethods.openEdit(id);
        } else if (target.getAttribute("data-match") === "remove"
        || target.matches("[data-match=remove] *")
        ) {
            let id = getButtom(target);
            if (id === null) {
                console.warn("There is something wrong in buttom remove");
                return;
            }
            TodosMethods.remove(id);
        }
    });
}
{//Modal Todo
    //close button
    const closeButton = document.getElementById("modal_todo-button-close");
    closeButton.onclick = ModalTodoMethods.closeTodoModal;

    //Tags Input
    function handleOnkeydown(e) {
        switch (e.key) {
            case " ": {
                e.preventDefault();
            };break;
            case "Enter" : {
                ModalTodoMethods.addInputTag();
                e.preventDefault();
            }
        }
    }
    const tagsInput = ModalTodoDOM.tagsInput;
    tagsInput.oninput = function tioi(e) {
        let value = e.currentTarget.value;
        ModalTodoMethods.createSuggested(value);
        ModalTodoTagsState.input = value;
    };
    tagsInput.onkeydown = handleOnkeydown;

    //Add tag button
    const tagsAdd = ModalTodoDOM.tagsAdd;
    tagsAdd.onclick = ModalTodoMethods.addInputTag;
    tagsAdd.onkeydown = handleOnkeydown;

    //tags suggested handler
    const DOMTagsSuggested = ModalTodoDOM.tagsSuggested;
    DOMTagsSuggested.addEventListener("pointerdown", function (e) {
        const target = e.target;
        if (target.getAttribute("data-match") !== null) {
            const tag = target.getAttribute("data-value");
            if (tag === null) {
                return;
            }
            ModalTodoMethods.addTag(tag);
        }
    });
    //tags selected handler
    const DOMTagsSelected = ModalTodoDOM.tagsSelected;
    DOMTagsSelected.addEventListener("click", function (e) {
        const target = e.target;
        if (target.getAttribute("data-match") !== null) {
            const tag = target.getAttribute("data-value");
            if (tag === null) {
                return;
            }
            target.remove();
            ModalTodoMethods.removeTag(tag);
        }
    })
}
{//Filter
    //actions
    FilterDOM.buttonComplete.onclick = FilterMethods.completeAll;
    FilterDOM.buttonClear.onclick = FilterMethods.clearCompleted;

    //status
    const DOMStatus = document.getElementById("global_filter-status")
    DOMStatus?.addEventListener(
        "click",
        function (e) {
            const target = e.target;
            if (target.name === "status") {
                FilterMethods.changeStatus(target.value);
            }
        }
    );

    //colors
    const DOMColors = document.getElementById("global_filter-colors")
    DOMColors?.addEventListener(
        "click",
        function (e) {
            const target = e.target;
            if (target.name === "color") {
                FilterMethods.changeColor(target.value, target.checked);
            }
        }
    );

    //tags
    const DOMTagsInput = FilterDOM.tagsInput;
    DOMTagsInput.oninput = function tioi(e) {
        const value = e.currentTarget.value;
        FilterDOMMethods.createSuggested(value);
        FilterTagsState.input = value;
    };

    DOMTagsInput.onkeydown = function okd(e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
        }
    };
    //suggested handler
    const DOMTagsSuggested = FilterDOM.tagsSuggested;
    DOMTagsSuggested.addEventListener("pointerdown", function (e) {
        const target = e.target;
        if (target.getAttribute("data-match") !== null) {
            const tag = target.getAttribute("data-value");
            if (tag === null) {
                return;
            }
            FilterDOMMethods.addTag(tag);
        }
    });
    //selected handler
    const DOMTagsSelected = FilterDOM.tagsSelected;
    DOMTagsSelected.addEventListener("click", function (e) {
        const target = e.target;
        if (target.getAttribute("data-match") !== null) {
            const tag = target.getAttribute("data-value");
            if (tag === null) {
                return;
            }
            target.remove();
            FilterDOMMethods.removeTag(tag);
        }
    })
}
{//Filter Modal
    const openModalFilter = document.getElementById("header_button-filter");
    openModalFilter.onclick = FilterDOMMethods.openModal;

    const closeModalFilter = document.getElementById(
        "modal_filter-button-close"
    );
    closeModalFilter.onclick = FilterDOMMethods.closeModal;
}

//PWA
if (navigator.serviceWorker !== undefined) {
    navigator.serviceWorker.register("serviceworker.js");
}

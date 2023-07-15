import {
    TagsState,
    TagsMethods,
    TodosState,
    TodosMethods
} from "./state.js";
import {createTodo} from "./tempate-todo.js";
import {createSuggested} from "./tags-suggested.js";

const ModalTodoState = {
    CREATE: "create",
    CREATE_TITLE: "New Todo",
    EDIT: "edit",
    EDIT_TITLE: "Edit Todo",
    editId: "",
};

const ModalTodoTagsState = {
    input: "",
    /**
    @type {Array<string>} */
    selected: [],
    charSuggested: "",
    //suggested have the index of tags that exist in tempSuggested
    /**
    @type {Array<number>} */
    suggested: [],
    //allocate all tags that start with charSuggested
    /**
    @type {Array<string>} */
    tempSuggested: [],
};

const MODAL_TODO_ID = "modal_todo";
const ModalTodoDOM = {
    root: document.getElementById(MODAL_TODO_ID),
    title: document.getElementById("modal_todo-title"),
    text: document.getElementById(MODAL_TODO_ID).text,
    sectionDate: document.getElementById("modal_todo-section-date"),
    changeDate: document.getElementById(MODAL_TODO_ID).change_date,
    color: document.getElementById(MODAL_TODO_ID).color,
    tagsInput:  document.getElementById(MODAL_TODO_ID).tags_input,
    tagsAdd: document.getElementById(MODAL_TODO_ID).tags_add,
    tagsSuggested: document.getElementById(MODAL_TODO_ID).tags_suggested,
    sectionSelected: document.getElementById("modal_todo-section-selected"),
    tagsSelected: document.getElementById(MODAL_TODO_ID).tags_selected,
    buttonComplete: document.getElementById(MODAL_TODO_ID).button_complete,

    //Warning: The fragment must use inside a function and only be
    //a temporal buffer for some Elements, once the function ends the
    //frament must have no childs (thats means you need to call
    //replaceChildren method to clean it up, or to move the children)
    fragment: document.createDocumentFragment()
};

const ModalTodoMethods = {
    /**
    @type {(tag: string) => DOMButtonTag} */
    createDOMTagSelected(tag) {
        const DOMTagSelected = (
            TagsMethods.createDOMButtonTag(tag)
        );
        //DOMTagSelected.onclick = ModalTodoMethods.removeTag;
        return DOMTagSelected;
    },
    /**
    @type {(tag: string) => DOMButtonTag} */
    createDOMTagSuggested(tag) {
        const DOMTagSuggested = (
            TagsMethods.createDOMButtonTag(tag)
        );
        //DOMTagSuggested.onpointerdown = ModalTodoMethods.addSuggestedTag;
        return DOMTagSuggested;
    },
    /**
    @type {() => undefined} */
    closeTodoModal() {
        ModalTodoDOM.root.setAttribute("data-display", "0");
        document.body.style.overflow = "";
    },
    /**
    @type {(tags: Array<string>) => undefined} */
    initTagsEdit(tags) {
        if (tags.length > 0) {
            const tagsSelected = ModalTodoTagsState.selected;
            //Remember the HTMLCollection can mutate
            const DOMSChildren = ModalTodoDOM.tagsSelected.children;
            const oldLen = tagsSelected.length;
            for (let i = 0; i < tags.length; i += 1) {
                let tag = tags[i];
                if (tag !== tagsSelected[i]) {
                    if (i < oldLen) {
                    // DOMButtonTag must be always be DOMSChildren[0],
                    // because the next element in the HTMLCollection
                    // becomes DOMSChildren[0] when we append the
                    // current DOMSChildren[0] to the fragment.
                        const DOMButtonTag = DOMSChildren[0];
                        TagsMethods.editDOMButtonTag(DOMButtonTag, tag);
                        ModalTodoDOM.fragment.appendChild(DOMButtonTag);
                    } else {
                        const DOMTagSelected = (
                            ModalTodoMethods.createDOMTagSelected(tag)
                        );
                        ModalTodoDOM.fragment.appendChild(DOMTagSelected);
                    }
                    tagsSelected[i] = tag;
                } else {
                    ModalTodoDOM.fragment.appendChild(DOMSChildren[0]);
                }
            }
            if (tags.length < tagsSelected.length) {
                tagsSelected.length = tags.length;
            }

            ModalTodoDOM.sectionSelected.setAttribute("data-display", "1");
            Element.prototype.replaceChildren.apply(
                ModalTodoDOM.tagsSelected,
                ModalTodoDOM.fragment.children
            );
        } else {
            ModalTodoTagsState.selected.length = 0;
            ModalTodoDOM.sectionSelected.setAttribute("data-display", "0");
            ModalTodoDOM.tagsSelected.replaceChildren();
        }
    },
    /**
    @type {() => undefined} */
    openTodoModal() {
        ModalTodoDOM.tagsSuggested.setAttribute("data-show", "0");
        ModalTodoDOM.tagsInput.value = "";

        ModalTodoDOM.root.setAttribute("data-display", "1");
        document.body.style.overflow = "hidden";

        ModalTodoDOM.text.focus();
    },
    /**
    @type {(tag: string) => undefined} */
    removeTag(tag) {
        const tagsSelected = ModalTodoTagsState.selected;
        let i = tagsSelected.indexOf(tag);
        if (i !== -1) {
            tagsSelected.copyWithin(
                i,
                i + 1,
                tagsSelected.length
            );
            tagsSelected.pop();
        }
        if (tagsSelected.length === 0) {
            ModalTodoDOM.sectionSelected.setAttribute("data-display", "0");
        }
    },
    /**
    @type {() => undefined} */
    resetTagsSelected() {
        ModalTodoTagsState.selected.length = 0;
        ModalTodoDOM.tagsSelected.replaceChildren();
    },
    /**
    @type {(tag: string) => undefined} */
    addTag(tag) {
        const tagsSelected = ModalTodoTagsState.selected;
        if (tagsSelected.length === 0) {
            const DOMTagSelected = ModalTodoMethods.createDOMTagSelected(tag);
            ModalTodoDOM.tagsSelected.appendChild(DOMTagSelected);
            tagsSelected.push(tag);
            ModalTodoDOM.sectionSelected.setAttribute("data-display", "1");
        } else if (!tagsSelected.includes(tag)) {
            const DOMTagSelected = ModalTodoMethods.createDOMTagSelected(tag);
            ModalTodoDOM.tagsSelected.appendChild(DOMTagSelected);
            tagsSelected.push(tag);
        }
        ModalTodoTagsState.input = "";
        ModalTodoDOM.tagsInput.value = "";
        ModalTodoDOM.tagsSuggested.setAttribute("data-show", "0");
    },
    /**
    @type {() => undefined} */
    addInputTag() {
        const tag = ModalTodoTagsState.input;
        if (tag.length === 0) {
            return;
        }
        ModalTodoMethods.addTag(tag);
    },
    /**
    @type {(value: string) => undefined} */
    createSuggested(value) {
        createSuggested(value, ModalTodoTagsState, ModalTodoDOM);
    },
    /**
    @type {() => undefined} */
    completeEdit() {
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
    },
    /**
    @type {(id: string) => undefined} */
    openEdit(id) {
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
        ModalTodoDOM.buttonComplete.onclick = ModalTodoMethods.completeEdit;

        ModalTodoMethods.openTodoModal();
    },
    /**
    @type {OnClickHandler<HTMLButtonElement>} */
    completeCreate() {
        if (ModalTodoDOM.text.value.length === 0) {
            //we can not create a new todo
            //if it has no text
            return;
        }
        createTodo(
            /*text*/ ModalTodoDOM.text.value,
            /*color*/ ModalTodoDOM.color.value,
            /*tags*/ ModalTodoTagsState.selected
        );
        ModalTodoMethods.closeTodoModal();
    },
    /**
    @type {() => undefined} */
    openCreate() {
        ModalTodoDOM.title.textContent = ModalTodoState.CREATE_TITLE;

        ModalTodoDOM.text.value = "";
        ModalTodoDOM.color.value = "default";
        ModalTodoDOM.sectionDate.setAttribute("data-display", "0");
        ModalTodoDOM.sectionSelected.setAttribute("data-display", "0");

        ModalTodoDOM.tagsSuggested.setAttribute("data-show", "0");

        ModalTodoDOM.buttonComplete.textContent = "create";
        ModalTodoDOM.buttonComplete.onclick = ModalTodoMethods.completeCreate;

        ModalTodoMethods.resetTagsSelected();
        ModalTodoMethods.openTodoModal();
    }
};

export {
    ModalTodoDOM,
    ModalTodoState,
    ModalTodoTagsState,
    ModalTodoMethods
};

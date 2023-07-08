import {TagsMethods} from "./state.js";

const ModalTodoDOM = (function () {
    const ModalTodoDOMRoot = document.getElementById("modal_todo");
    return {
        root: ModalTodoDOMRoot,
        title: document.getElementById("modal_todo-title"),
        text: ModalTodoDOMRoot.text,
        sectionDate: document.getElementById("modal_todo-section-date"),
        changeDate: ModalTodoDOMRoot.change_date,
        color: ModalTodoDOMRoot.color,
        tagsInput:  ModalTodoDOMRoot.tags_input,
        tagsAdd: ModalTodoDOMRoot.tags_add,
        tagsSugested: ModalTodoDOMRoot.tags_suggested,
        tagsSelected: ModalTodoDOMRoot.tags_selected,
        buttonComplete: ModalTodoDOMRoot.button_complete,
        fragment: document.createDocumentFragment()
    };
}());

const ModalTodoState = {
    CREATE: "create",
    CREATE_TITLE: "New Todo",
    EDIT: "edit",
    EDIT_TITLE: "Edit Todo",
    editId: "",
    /**
    @type {Array<string>} */
    tagsSelected: [],
    selectedChange: false,
    /**
    @type {Array<string>} */
    tagsSuggested: [],
};


const ModalTodoMethods = {
    /**
    @type {(tag: string) => DOMButtonTag} */
    createDOMTagSelected(tag) {
            const DOMTagSelected = TagsMethods.createDOMButtonTag(tag);
            DOMTagSelected.addEventListener(
                "click",
                ModalTodoMethods.removeTagSelected
            );
            return DOMTagSelected;
    },
    /**
    @type {(tag: string) => DOMButtonTag} */
    createDOMTagSuggested(tag) {
        const DOMTagSuggested = TagsMethods.createDOMButtonTag(tag);
        DOMTagSuggested.onclick = null;
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
        ModalTodoState.tagsSuggested.length = 0;
        ModalTodoDOM.tagsSugested.replaceChildren();

        if (tags.length > 0) {
            const tagsSelected = ModalTodoState.tagsSelected;
            const DOMSChildren = ModalTodoDOM.tagsSelected.children;

            for (let i = 0; i < tags.length; i += 1) {
                tagsSelected[i] = tags[i];

                if (i < tagsSelected.length) {
                    DOMSChildren[i].name = tags[i];
                    DOMSChildren[i].setAttribute("data-value", tags[i]);
                    let span = DOMSChildren[i].firstElementChild;
                    if (span !== null) {
                        span.textContent = tags[i];
                    }
                    ModalTodoDOM.fragment.appendChild(DOMSChildren[i]);
                } else {
                    const DOMTagSelected = (
                        ModalTodoMethods.createDOMTagSelected(tags[i])
                    );
                    ModalTodoDOM.fragment.appendChild(DOMTagSelected);
                }
            }
            if (tags.length < tagsSelected.length) {
                tagsSelected.length = tags.length;
            }
            Element.prototype.replaceChildren.apply(
                ModalTodoDOM.tagsSelected,
                ModalTodoDOM.fragment.children
            );
        }
    },
    /**
    @type {() => undefined} */
    openTodoModal() {
        ModalTodoDOM.root.setAttribute("data-display", "1");
        document.body.style.overflow = "hidden";
    },
    /**
    @type {OnClickHandler<HTMLButtonElement>} */
    removeTagSelected(e) {
        const tag = e.currentTarget.getAttribute("data-value");
        e.currentTarget.remove();
        if (tag !== null) {
            let i = ModalTodoState.tagsSelected.indexOf(tag);
            if (i !== -1) {
                ModalTodoState.tagsSelected.copyWithin(
                    i,
                    i + 1,
                    ModalTodoState.tagsSelected.length
                );
                ModalTodoState.tagsSelected.pop();
            }
        }
    },
    /**
    @type {() => undefined} */
    resetTags() {
        ModalTodoState.tagsSelected.length = 0;
        ModalTodoState.tagsSuggested.length = 0;
        ModalTodoDOM.tagsSelected.replaceChildren();
        ModalTodoDOM.tagsSugested.replaceChildren();
    },
}


{ //Initializations

    const closeButton = document.getElementById("modal_todo-button-close");
    closeButton.onclick = ModalTodoMethods.closeTodoModal;
}

export {
    ModalTodoDOM,
    ModalTodoState,
    ModalTodoMethods
};

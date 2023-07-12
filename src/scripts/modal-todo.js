import {TagsState, TagsMethods, TodosState} from "./state.js";

const ModalTodoState = {
    CREATE: "create",
    CREATE_TITLE: "New Todo",
    EDIT: "edit",
    EDIT_TITLE: "Edit Todo",
    editId: "",
};

/**
@type {TagsSectionState} */
const ModalTodoTagsState = {
    input: "",
    /**
    @type {Array<string>} */
    selected: [],
    charSuggested: "",
    /**
    @type {Array<string>} */
    suggested: [],
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
            TagsMethods.createDOMButtonTag(tag, `tagse_${tag}`)
        );
        DOMTagSelected.onclick = ModalTodoMethods.removeTag;
        return DOMTagSelected;
    },
    /**
    @type {(tag: string) => DOMButtonTag} */
    createDOMTagSuggested(tag) {
        const DOMTagSuggested = (
            TagsMethods.createDOMButtonTag(tag, `tagsu_${tag}`)
        );
        DOMTagSuggested.onpointerdown = ModalTodoMethods.addSuggestedTag;
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
    @type {OnClickHandler<HTMLButtonElement>} */
    removeTag(e) {
        const tag = e.currentTarget.getAttribute("data-value");
        e.currentTarget.remove();
        if (tag === null) {
            return;
        }
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
    @type {OnClickHandler<HTMLButtonElement>} */
    addSuggestedTag(e) {
        const tag = e.currentTarget.getAttribute("data-value");
        ModalTodoMethods.addTag(tag);
    },
    /**
    @type {(value: string) => undefined} */
    createSuggested(value) {
        const tagsSuggested = ModalTodoTagsState.suggested;
        if (value.length === 0) {
            ModalTodoDOM.tagsSuggested.setAttribute("data-show", "0");
            return;
        } else if (value.length === 1) {
            const DOMTSChildren = ModalTodoDOM.tagsSuggested.children;
            const tempTagsSuggested = ModalTodoTagsState.tempSuggested;
            if (value === ModalTodoTagsState.charSuggested) {
                for (let i = 0; i < tempTagsSuggested.length; i += 1) {
                    tagsSuggested[i] = tempTagsSuggested[i];
                    DOMTSChildren[i].setAttribute("data-display", "1");
                }
            } else {
                ModalTodoTagsState.charSuggested = value;
                let i = 0;
                let oldSuggestedLen = tagsSuggested.length;
                for (let stag in TagsState) {
                    if (value === stag[0]) {
                        let DOMButtonTag;
                        if (i < oldSuggestedLen) {
                            DOMButtonTag = DOMTSChildren[0];
                            TagsMethods.editDOMButtonTag(
                                DOMButtonTag,
                                stag,
                                `tagsu_${stag}`
                            );
                            DOMButtonTag.setAttribute("data-display", "1");
                        } else {
                            DOMButtonTag = (
                                ModalTodoMethods.createDOMTagSuggested(stag)
                            );
                        }
                        ModalTodoDOM.fragment.appendChild(DOMButtonTag);
                        tagsSuggested[i] = stag;
                        tempTagsSuggested[i] = stag;
                        i += 1;
                    }
                }
                if (i < tagsSuggested.length) {
                    tagsSuggested.length = i;
                }
                if (i < tempTagsSuggested.length) {
                    tempTagsSuggested.length = i;
                }
                Element.prototype.replaceChildren.apply(
                    ModalTodoDOM.tagsSuggested,
                    ModalTodoDOM.fragment.children
                );
            }
            if (tagsSuggested.length > 0) {
                ModalTodoDOM.tagsSuggested.setAttribute("data-show", "1");
            } else {
                ModalTodoDOM.tagsSuggested.setAttribute("data-show", "0");
            };
        //In this point we are working with what we get in tagsSugested or
        //tempTagsSuggested
        } else if (
            ModalTodoTagsState.input.length < value.length
            && tagsSuggested.length > 0
        ) {
            const DOMRoot = ModalTodoDOM.root;
            let head = 0;
            for (let i = 0; i < tagsSuggested.length; i += 1) {
                let tagSug = tagsSuggested[i];
                let DOMButtonTag = DOMRoot[`tagsu_${tagSug}`];
                if (tagSug.startsWith(value)) {
                    DOMButtonTag.setAttribute("data-display", "1");
                    tagsSuggested[head] = tagSug;
                    head += 1;
                } else {
                    DOMButtonTag.setAttribute("data-display", "0");
                }
            }
            if (head < tagsSuggested.length) {
                tagsSuggested.length = head;
            }
            if (tagsSuggested.length > 0) {
                ModalTodoDOM.tagsSuggested.setAttribute("data-show", "1");
            } else {
                ModalTodoDOM.tagsSuggested.setAttribute("data-show", "0");
            };
        } else if (
            ModalTodoTagsState.tempSuggested.length > 0
            && value.length < ModalTodoTagsState.input.length
        ) {
            const DOMTSChildren = ModalTodoDOM.tagsSuggested.children;
            const tempTagsSuggested = ModalTodoTagsState.tempSuggested;
            let head = 0;
            for (let i = 0; i < tempTagsSuggested.length; i += 1) {
                let tagSug = tempTagsSuggested[i];
                let DOMButtonTag = DOMTSChildren[i];
                if (tagSug.startsWith(value)) {
                    DOMButtonTag.setAttribute("data-display", "1");
                    tagsSuggested[head] = tagSug;
                    head += 1;
                } else {
                    DOMButtonTag.setAttribute("data-display", "0");
                }
            }
            if (head < tagsSuggested.length) {
                tagsSuggested.length = head;
            }
            if (tagsSuggested.length > 0) {
                ModalTodoDOM.tagsSuggested.setAttribute("data-show", "1");
            } else {
                ModalTodoDOM.tagsSuggested.setAttribute("data-show", "0");
            };
        }
    }
};

{ //Initializations
    const closeButton = document.getElementById("modal_todo-button-close");
    closeButton.onclick = ModalTodoMethods.closeTodoModal;

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

    const tagsAdd = ModalTodoDOM.tagsAdd;
    tagsAdd.onclick = ModalTodoMethods.addInputTag;
    tagsAdd.onkeydown = handleOnkeydown;
}

export {
    ModalTodoDOM,
    ModalTodoState,
    ModalTodoTagsState,
    ModalTodoMethods
};

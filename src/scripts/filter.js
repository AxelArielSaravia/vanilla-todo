import {
    FilterState,
    FilterMethods,
    TagsState,
    TagsMethods
} from "./state.js";
import {createSuggested} from "./tags-suggested.js";

const FilterTagsState = {
    input: "",
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

const FILTER_ID = "general_filter";
const FilterDOM = {
    root: document.getElementById(FILTER_ID),
    buttonComplete: document.getElementById(FILTER_ID).button_complete,
    buttonClear: document.getElementById(FILTER_ID).button_clear,
    status: document.getElementById(FILTER_ID).status,
    color: document.getElementById(FILTER_ID).color,
    tagsInput: document.getElementById(FILTER_ID).tags_input,
    tagsSuggested: document.getElementById(FILTER_ID).tags_suggested,
    noTagsSuggeted: document.getElementById(FILTER_ID).no_tags_suggested,
    sectionSelected: document.getElementById("general_filter-section-selected"),
    tagsSelected: document.getElementById(FILTER_ID).tags_selected,
    //Warning: The fragment must use inside a function and only be
    //a temporal buffer for some Elements, once the function ends the
    //frament must have no childs (thats means you need to call
    //replaceChildren method to clean it up, or to move the children)
    fragment: document.createDocumentFragment()
};

const FilterDOMMethods = {
    /**
    @type {OnClickHandler<HTMLButtonElement>} */
    openModal() {
        const modalFilter = document.getElementById("modal_filter");
        if (modalFilter === null) {
            console.warn("WARN: modal.filter does not exist");
            return;
        }
        modalFilter.setAttribute("data-display", "1");
        document.body.style.overflow = "hidden";
    },
    /**
    @type {OnClickHandler<HTMLButtonElement>} */
    closeModal() {
        const modalFilter = document.getElementById("modal_filter");
        if (modalFilter === null) {
            console.warn("WARN: modal.filter does not exist");
            return;
        }
        modalFilter.setAttribute("data-display", "0");
        document.body.style.overflow = "";
    },
    /**
    @type {(e: MediaQueryListEvent | MediaQueryList) => undefined} */
    onMatchMedia(e) {
        const generalFilter = FilterDOM.root;
        const modal = document.getElementById("modal_filter");
        if (e.matches) {
            let display = modal.getAttribute("data-display");
            if (display === "1") {
                modal.setAttribute("data-display", "0");
                document.body.style.overflow = "";
            }
            document.getElementById("aside_filter").appendChild(generalFilter);
        } else {
            modal.firstElementChild?.appendChild(generalFilter);
        }
    },
    /**
    @type {(tag: string) => undefined} */
    addTag(tag) {
        let added = FilterMethods.addTag(tag);
        if (added) {
            const DOMTagSelected = TagsMethods.createDOMButtonTag(tag);
            FilterDOM.tagsSelected.appendChild(DOMTagSelected);
            FilterDOM.sectionSelected?.setAttribute("data-display", "1");
        }
        FilterTagsState.input = "";
        FilterDOM.tagsInput.value = "";
        FilterDOM.tagsSuggested.setAttribute("data-show", "0");
    },
    /**
    @type {(tag: string) => undefined} */
    removeTag(tag) {
        FilterMethods.removeTag(tag);
        if (FilterState.tags.length === 0) {
            FilterDOM.sectionSelected?.setAttribute("data-display", "0");
        }
    },
    /**
    @type {(value: string) => undefined} */
    createSuggested(value) {
        createSuggested(value, FilterTagsState, FilterDOM);
    }
};

export {
    FilterTagsState,
    FilterDOM,
    FilterDOMMethods
};

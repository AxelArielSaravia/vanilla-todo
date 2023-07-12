import {
    FilterState,
    FilterMethods,
    TagsState,
    TagsMethods
} from "./state.js";
import {MATCH_MIN_WIDTH_780} from "./match-media.js";

const FilterTagsState = {
    input: "",
    charSuggested: "",
    /**
    @type {Array<string>} */
    suggested: [],
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
    @type {OnClickHandler<DOMFilterStatus>} */
    changeStatus(e) {
        FilterMethods.changeStatus(e.currentTarget.value);
    },
    /**
    @type {OnClickHandler<DOMFilterColor>} */
    changeColor(e) {
        const colorElement = e.currentTarget;
        FilterMethods.changeColor(colorElement.value, colorElement.checked);
    },
    /**
    @type {(tag: string) => DOMButtonTag} */
    createDOMTagSelected(tag) {
        const DOMTagSelected = (
            TagsMethods.createDOMButtonTag(tag, `tagse_${tag}`)
        );
        DOMTagSelected.onclick = FilterDOMMethods.removeTag;
        return DOMTagSelected;
    },
    /**
    @type {(tag: string) => DOMButtonTag} */
    createDOMTagSuggested(tag) {
        const DOMTagSuggested = (
            TagsMethods.createDOMButtonTag(tag, `tagsu_${tag}`)
        );
        DOMTagSuggested.onpointerdown = FilterDOMMethods.addTag;
        return DOMTagSuggested;
    },
    /**
    @type {OnClickHandler<HTMLButtonElement>} */
    addTag(e) {
        const tag = e.currentTarget.getAttribute("data-value");
        let added = FilterMethods.addTag(tag);
        if (added) {
            const DOMTagSelected = FilterDOMMethods.createDOMTagSelected(tag);
            FilterDOM.tagsSelected.appendChild(DOMTagSelected);
            FilterDOM.sectionSelected?.setAttribute("data-display", "1");
        }
        FilterTagsState.input = "";
        FilterDOM.tagsInput.value = "";
        FilterDOM.tagsSuggested.setAttribute("data-show", "0");
    },
    /**
    @type {OnClickHandler<HTMLButtonElement>} */
    removeTag(e) {
        const tag = e.currentTarget.getAttribute("data-value");
        if (tag === null) {
            return;
        }
        e.currentTarget.remove();
        FilterMethods.removeTag(tag);
        if (FilterState.tags.length === 0) {
            FilterDOM.sectionSelected?.setAttribute("data-display", "0");
        }
    },
    /**
    @type {(value: string) => undefined} */
    createSuggested(value) {
        const tagsSuggested = FilterTagsState.suggested;
        if (value.length === 0) {
            FilterDOM.tagsSuggested.setAttribute("data-show", "0");
            FilterDOM.noTagsSuggeted.setAttribute("data-show", "0");
            return;
        } else if (value.length === 1) {
            const DOMTSChildren = FilterDOM.tagsSuggested.children;
            const tempTagsSuggested = FilterTagsState.tempSuggested;
            if (value === FilterTagsState.charSuggested) {
                for (let i = 0; i < tempTagsSuggested.length; i += 1) {
                    tagsSuggested[i] = tempTagsSuggested[i];
                    DOMTSChildren[i].setAttribute("data-display", "1");
                }
            } else {
                FilterTagsState.charSuggested = value;
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
                                FilterDOMMethods.createDOMTagSuggested(stag)
                            );
                        }
                        FilterDOM.fragment.appendChild(DOMButtonTag);
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
                    FilterDOM.tagsSuggested,
                    FilterDOM.fragment.children
                );
            }
        //In this point we are working with what we get in tagsSugested or
        //tempTagsSuggested
        } else if (
            FilterTagsState.input.length < value.length
            && tagsSuggested.length > 0
        ) {
            const DOMRoot = FilterDOM.root;
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
        } else if (
            FilterTagsState.tempSuggested.length > 0
            && value.length < FilterTagsState.input.length
        ) {
            const DOMTSChildren = FilterDOM.tagsSuggested.children;
            const tempTagsSuggested = FilterTagsState.tempSuggested;
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
        }
        if (tagsSuggested.length > 0) {
            FilterDOM.tagsSuggested.setAttribute("data-show", "1");
            FilterDOM.noTagsSuggeted.setAttribute("data-show", "0");
        } else {
            FilterDOM.tagsSuggested.setAttribute("data-show", "0");
            FilterDOM.noTagsSuggeted.setAttribute("data-show", "1");
        };
    }
};


{ // general
    //actions
    FilterDOM.buttonComplete.onclick = FilterMethods.completeAll;
    FilterDOM.buttonClear.onclick = FilterMethods.clearCompleted;

    //status
    const statusList = FilterDOM.status;
    for (let i = 0; i < statusList.length; i += 1) {
        const statusElement = statusList[i];
        statusElement.onclick = FilterDOMMethods.changeStatus;
    }

    //colors
    const colorList = FilterDOM.color;
    for (let i = 0; i < colorList.length; i += 1) {
        const colorElement = colorList[i];
        colorElement.onclick = FilterDOMMethods.changeColor;
    }

    //tags
    const tagsInput = FilterDOM.tagsInput;
    tagsInput.oninput = function tioi(e) {
        const value = e.currentTarget.value;
        FilterDOMMethods.createSuggested(value);
        FilterTagsState.input = value;
    };

    tagsInput.onkeydown = function okd(e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
        }
    };
}
{ //MatchMedia
    MATCH_MIN_WIDTH_780.addEventListener("change", FilterDOMMethods.onMatchMedia);
    if (MATCH_MIN_WIDTH_780.matches) {
        FilterDOMMethods.onMatchMedia(MATCH_MIN_WIDTH_780);
    }
}
{ //Modal
    const openModalFilter = document.getElementById("header_button-filter");
    openModalFilter.onclick = FilterDOMMethods.openModal;

    const closeModalFilter = document.getElementById(
        "modal_filter-button-close"
    );
    closeModalFilter.onclick = FilterDOMMethods.closeModal;
}

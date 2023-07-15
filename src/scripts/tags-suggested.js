import {TagsState, TagsMethods} from "./state.js";
/**
@type {<
    T extends {
        input: string,
        charSuggested: string,
        suggested: Array<number>,
        tempSuggested: Array<string>
    },
    D extends {
        tagsSuggested: HTMLFieldSetElement,
        fragment: DocumentFragment
    }
>(
    value: string,
    tagsState: T,
    DOMTags: D
) => undefined} */
function createSuggested(value, tagsState, DOM) {
    const tagsSuggested = tagsState.suggested;
    if (value.length === 0) {
        DOM.tagsSuggested.setAttribute("data-show", "0");
        return;
    } else if (value.length === 1) {
        const DOMTSChildren = DOM.tagsSuggested.children;
        const tempTagsSuggested = tagsState.tempSuggested;
        if (value === tagsState.charSuggested) {
            for (let i = 0; i < tempTagsSuggested.length; i += 1) {
                tagsSuggested[i] = i;
                DOMTSChildren[i].setAttribute("data-display", "1");
            }
        } else {
            tagsState.charSuggested = value;
            let i = 0;
            let oldSuggestedLen = tagsSuggested.length;
            for (let stag in TagsState) {
                if (value === stag[0]) {
                    let DOMButtonTag;
                    if (i < oldSuggestedLen) {
                        DOMButtonTag = DOMTSChildren[0];
                        TagsMethods.editDOMButtonTag(
                            DOMButtonTag,
                            stag
                        );
                        DOMButtonTag.setAttribute("data-display", "1");
                    } else {
                        DOMButtonTag = TagsMethods.createDOMButtonTag(stag);
                    }
                    DOM.fragment.appendChild(DOMButtonTag);
                    tagsSuggested[i] = i;
                    tempTagsSuggested[i] = stag;
                    i += 1;
                }
            }
            if (i < tempTagsSuggested.length) {
                tagsSuggested.length = i;
                tempTagsSuggested.length = i;
            }
            Element.prototype.replaceChildren.apply(
                DOM.tagsSuggested,
                DOM.fragment.children
            );
        }
        if (tagsSuggested.length > 0) {
            DOM.tagsSuggested.setAttribute("data-show", "1");
        } else {
            DOM.tagsSuggested.setAttribute("data-show", "0");
        };
        //In this point we are working with what we get in tagsSugested or
        //tempTagsSuggested
    } else if (
        tagsState.input.length < value.length
        && tagsSuggested.length > 0
    ) {
        const DOMTSChildren = DOM.tagsSuggested.children;
        const tempTagsSuggested = tagsState.tempSuggested;
        let head = 0;
        for (let i = 0; i < tagsSuggested.length; i += 1) {
            let j = tagsSuggested[i];
            let tagSug = tempTagsSuggested[j];
            let DOMButtonTag = DOMTSChildren[j];
            if (tagSug.startsWith(value)) {
                DOMButtonTag.setAttribute("data-display", "1");
                tagsSuggested[head] = j;
                head += 1;
            } else {
                DOMButtonTag.setAttribute("data-display", "0");
            }
        }
        if (head < tagsSuggested.length) {
            tagsSuggested.length = head;
        }
        if (tagsSuggested.length > 0) {
            DOM.tagsSuggested.setAttribute("data-show", "1");
        } else {
            DOM.tagsSuggested.setAttribute("data-show", "0");
        };
    } else if (
        tagsState.tempSuggested.length > 0
        && value.length < tagsState.input.length
    ) {
        const DOMTSChildren = DOM.tagsSuggested.children;
        const tempTagsSuggested = tagsState.tempSuggested;
        let head = 0;
        for (let i = 0; i < tempTagsSuggested.length; i += 1) {
            let tagSug = tempTagsSuggested[i];
            let DOMButtonTag = DOMTSChildren[i];
            if (tagSug.startsWith(value)) {
                DOMButtonTag.setAttribute("data-display", "1");
                tagsSuggested[head] = i;
                head += 1;
            } else {
                DOMButtonTag.setAttribute("data-display", "0");
            }
        }
        if (head < tagsSuggested.length) {
            tagsSuggested.length = head;
        }
        if (tagsSuggested.length > 0) {
            DOM.tagsSuggested.setAttribute("data-show", "1");
        } else {
            DOM.tagsSuggested.setAttribute("data-show", "0");
        };
    }
}

export {
    createSuggested
}

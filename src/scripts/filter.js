import {FilterState, FilterMethods} from "./state.js";
import {MATCH_MIN_WIDTH_780} from "./match-media.js";

const FilterDOM = {
    root: document.getElementById("general_filter"),
    buttonComplete: document.getElementById("general_filter").button_complete,
    buttonClear: document.getElementById("general_filter").button_clear,
    status: document.getElementById("general_filter").status,
    color: document.getElementById("general_filter").color,
    tagsInput: document.getElementById("general_filter").tags_input,
    tagsSuggested: document.getElementById("general_filter").tags_suggested,
    tagsSelected: document.getElementById("general_filter").tags_selected,
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

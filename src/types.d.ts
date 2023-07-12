// General Utils
type ref<T extends {}> = T;
type maybe<T> = undefined | T;


// General Definitions
type Colors = (
    "default"
    | "blue"
    | "purple"
    | "pink"
    | "red"
    | "brown"
    | "yellow"
    | "green"
);

type Todo = {
    color: Colors,
    completed: boolean,
    date: number,
    id: string,
    tags: Array<string>,
    text: string,
};

type FilterStatus = "all" | "active" | "completed";


type TagsSectionState = {
    input: string,
    selected: Array<string>,
    charSuggested: string,
    suggested: Array<string>,
    tempSuggested: Array<string>,
};
type DOMTagsSection = {
    root: DOMModalTodo | DOMFilter,
    tagsInput: HTMLInputElement,
    tagsAdd?: HTMLButtonElement,
    sectionSelected: HTMLDivElement,
    tagsSuggested: HTMLFieldSetElement & {
        children: HTMLCollection & {
            [k: number]: DOMButtonTag
        }
    },
    tagsSelected: HTMLFieldSetElement & {
        children: HTMLCollection & {
            [k: number]: DOMButtonTag
        }
    },
    fragment: DocumentFragment
};

//DOM Definitions

//Todo Item
interface TemplateDOMTodo extends HTMLTemplateElement {
    content: FragmentTodoItem;
}
interface FragmentDOMTodo extends DocumentFragment {
    cloneNode(t?: boolean): FragmentTodoItem & {
        firstElementChild: DOMTodo
    };
}
interface DOMTodo extends HTMLDivElement {
    firstElementChild: HTMLDivElement & {
        firstElementChild: HTMLDivElement & {
            children: HTMLCollection & {
                0: HTMLParamElement,
                1: HTMLButtonElement,
                2: HTMLButtonElement,
                length: 3,
            };
            nextElementSibling: HTMLDivElement & {
                firstElementChild: HTMLParamElement
            }
        },
        lastElementChild: HTMLDivElement
    },
    lastElementChild: HTMLDivElement & {
        firstElementChild: HTMLButtonElement
    },
    header: HTMLDivElement & {firstElementChild: HTMLParamElement},
    main: HTMLDivElement & {firstElementChild: HTMLParamElement},
    footer: HTMLDivElement,
    buttonToggle: HTMLButtonElement
}

//Todo Tag
interface TemplateDOMTodoTag extends HTMLTemplateElement {
    content: FragmentDOMTodoTag;
}
interface FragmentDOMTodoTag extends DocumentFragment {
    cloneNode(t?: boolean): FragmentDOMTodoTag;
    firstElementChild: DOMTodoTag
}
interface DOMTodoTag extends HTMLDivElement {
    firstElementChild: HTMLSpanElement;
}

//Button Tag
interface TemplateDOMButtonTag extends HTMLTemplateElement {
    content: FragmentDOMButtonTag;
}
interface FragmentDOMButtonTag extends DocumentFragment {
    cloneNode(t?: boolean): FragmentDOMButtonTag;
    firstElementChild: TagDOMButton;
}
interface DOMButtonTag extends HTMLButtonElement {
    firstElementChild: HTMLSpanElement;
}

// Modal Todo
interface DOMModalTodo extends HTMLFormElement {
    text: HTMLTextAreaElement,
    change_date: RadioNodeList,
    color: RadioNodeList & {value: Color},
    tags_input: HTMLInputElement,
    tags_add: HTMLButtonElement,
    tags_suggested: HTMLFieldSetElement & {
        children: HTMLCollection & {
            [k: number]: DOMButtonTag
        }
    },
    tags_selected: HTMLFieldSetElement & {
        children: HTMLCollection & {
            [k: number]: DOMButtonTag
        }
    },
    button_complete: HTMLButtonElement,
    button_clear: HTMLButtonElement,
}

// General Filter
interface DOMFilterStatus extends HTMLInputElement {
    value: FilterStatus
    onclick: (
        OnClickHandler<DOMFilterStatus>
        | null
    )
}
interface DOMFilterColor extends HTMLInputElement {
    value: Colors,
    onclick: (
        OnClickHandler<DOMFilterColor>
        | null
    )
}

interface DOMFilter extends HTMLFormElement {
    id: "general_filter",
    button_complete: HTMLButtonElement,
    button_clear: HTMLButtonElement,
    status: RadioNodeList & {
        [k: number]: DOMFilterStatus,
        value: FilterStatus
    },
    color: RadioNodeList & {
        [k: number]: DOMFilterColor,
        value: Color
    },
    tags_input: HTMLInputElement,
    tags_suggested: HTMLFieldSetElement,
    no_tags_suggested: HTMLFieldSetElement,
    tags_selected: HTMLFieldSetElement
}

//Events handlers
interface GenericMouseEvent<T extends EventTarget> {
    readonly currentTarget: T
}

type OnClickHandler<ET extends EventTarget, R = undefined> = (
    (this: ET, ev: GenericMouseEvent<ET>) => R
);

//OVERRIDES

interface Storage {
    //override
    getItem(key: "theme"): "dark" | "light" | null
}

interface Document {
    //override
    getElementById(id: "header_button-theme"): HTMLButtonElement;
    getElementById(id: "header_button-add"): HTMLButtonElement;
    getElementById(id: "header_button-filter"): HTMLButtonElement;
    getElementById(id: "modal_todo-button-close"): HTMLButtonElement;
    getElementById(id: "modal_filter-button-close"): HTMLButtonElement;
    getElementById(id: "modal_init-button-close"): HTMLButtonElement;

    getElementById(id: "main"): HTMLElement;

    getElementById(id: "modal_init"): HTMLDivElement;

    getElementById(id: "modal_todo"): DOMModalTodo;

    getElementById(id: "modal_todo-title"): HTMLHeadingElement;
    getElementById(id: "modal_todo-section-date"): HTMLDivElement;
    getElementById(id: "modal_todo-section-selected"): HTMLDivElement;
    getElementById(id: "modal_todo-button-complete"): HTMLButtonElement;

    getElementById(id: "template_todo"): TemplateDOMTodo;
    getElementById(id: "template_todo-tag"): TemplateDOMTodoTag;
    getElementById(id: "template_button-tag"): TemplateDOMButtonTag;

    getElementById(id: "tags_suggested"): HTMLDivElement;

    getElementById(id: "general_filter"): DOMFilter;
    getElementById(id: "modal_filter"): HTMLDivElement;
    getElementById(id: "aside_filter"): HTMLElement;
}

interface DocumentFragment {
    cloneNode(t?: boolean): DocumentFragment;
    appendChild: <T extends Node>(c: T) => T;
}

type AddEventListener<ET extends string, L extends function> = (
    (
        eventType: ET,
        listener: L,
        options?: (
            boolean
            | {
                capture?: boolean,
                once?: boolean,
                passive?: boolean
                signal?: AbortSignal
            }
        )
    ) => undefined
);
interface HTMLButtonElement {
    //override
    onclick: (
        OnClickHandler<HTMLButtonElement>
        | null
    ),
    addEventListener: AddEventListener<"click", OnClickHandler<HTMLButtonElement>>,
}
interface HTMLInputElement {
    onclick: (
        OnClickHandler<HTMLInputElement>
        | null
    )
}

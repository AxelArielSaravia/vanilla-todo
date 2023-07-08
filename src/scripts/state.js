const DateTimeFormatter = Intl.DateTimeFormat(
    undefined,
    {
        dateStyle: "short",
        timeStyle: "short"
    }
);

const TodosState = {
    /**
    @type {Array<string>} */
   ids: [],
    /**
    @type {{[k: string]: Todo}} */
    todos: {},
    //Keeps the selected ids that must exist in the view
    /**
    @type {Array<string>} */
    selected: []
};

const TodosDOM = {
    root: document.getElementById("main"),
    /**
    @type {{[k: string]: DOMTodo}} */
    todos: {},
    fragment: document.createDocumentFragment(),
};

const FilterState = {
    // When we filter by colors, the filred todo must have
    // one of the required colors.
    // Its create a UNION of colorize todo's sets
    /**
    @type {Array<Colors>} */
    colors: [],
    /**
    @type {FilterStatus} */
    status: "all",
    //When we filter by tags, the filtred todo must have ALL required tags
    //Its create a intersection of todo's sets
    /**
    @type {Array<string>} */
    tags: []
};

const TagsState = {
    /**
    @type {{[k: string]: number}} */
    counter: {},
    /**
    @type {Array<string>} */
    tags: []
};
const TagsDOM = {
    templateButtonTag: document.getElementById("template_button-tag"),
    templateTodotag: document.getElementById("template_todo-tag"),
};

const TodosMethods = {
    /**
    @type {(id: string, todo: Todo, DOMTodo: DOMTodo) => undefined} */
    add(id, todo, DOMTodo) {
        TodosState.ids.push(id);
        TodosState.todos[id] = todo;
        TodosDOM.todos[id] = DOMTodo;

        localStorage.setItem(`todo.${id}`, JSON.stringify(todo));
        localStorage.setItem("todo.ids", JSON.stringify(TodosState.ids));

        if (todo.tags.length > 0) {
            TagsMethods.add(todo.tags);
        }
        if (FilterState.status !== "completed") {
            if (
                FilterState.colors.length > 0
                && !FilterMethods.includeColor(todo.color)
            ) {
                return;
            }
            if (
                FilterState.tags.length > 0
                && (
                    todo.tags.length === 0
                    || !FilterMethods.includeTags(todo.tags)
                )
            ) {
                return;
            }
            TodosState.selected.push(id);
            DOMTodo.setAttribute("data-display", "1");
        }
        TodosDOM.root?.appendChild(DOMTodo);
    },
    /**
    @type {(olds: Array<string>, news: Array<string>) => number} */
    compareTodoTags(olds, news) {
        if (olds.length === 0 && news.length === 0) {
            return -1;
        } else if (news.length === 0) {
            return -2;
        } else if (olds.length === 0) {
            return 0;
        }
        const min = (
            olds.length < news.length
            ? olds.length
            : news.length
        );
        for (let i = 0; i < min; i += 1) {
            if (olds[i] !== news[i]) {
                return i;
            }
        }
        if (olds.length !== news.length) {
            return min;
        }
        return -1;
    },
    /**
    @type {(
        id: string,
        changeDate: boolean,
        text: string,
        color: Colors,
        tags: maybe<Array<string>>
    ) => undefined} */
    edit(id, changeDate, text, color, tags) {
        const todo = TodosState.todos[id];
        if (todo === undefined) {
            return;
        }
        const DOMTodo = TodosDOM.todos[id];
        let ischanged = false;
        if (changeDate) {
            ischanged = true;
            const date = Date.now();
            todo.date = date;
            DOMTodo.header.firstElementChild.textContent = (
                DateTimeFormatter.format(date)
            );
            let i = TodosState.ids.indexOf(id);
            let l = TodosState.ids.length;
            if (i === -1) {
                console.error(
                    "TodosMethods.edit: There is no id in ids.",
                    "Something is break"
                );
                return;
            }
            TodosState.ids.copyWithin(i, i + 1, l);
            TodosState.ids[l - 1] = id;

            i = TodosState.selected.indexOf(id);
            if (i !== -1) {
                l = TodosState.selected.length;
                TodosState.selected.copyWithin(i, i + 1, l);
                TodosState.selected[l - 1] = id;
            }
            TodosDOM.root.appendChild(DOMTodo);
        }
        if (text !== todo.text) {
            ischanged = true;
            todo.text = text;
            DOMTodo.main.firstElementChild.textContent = text;
        }
        if (color !== todo.color) {
            ischanged = true;
            todo.color = color;
            DOMTodo.setAttribute("data-color", color);
        }
        if (tags !== undefined) {
            const i = TodosMethods.compareTodoTags(todo.tags, tags);
            if (i === -2) {
                ischanged = true;

                TagsMethods.remove(todo.tags)
                todo.tags.length = 0;
                DOMTodo.footer.replaceChildren();
            } else if (i !== -1) {
                ischanged = true;

                TagsMethods.add(tags, i);
                TagsMethods.remove(tags, i);
                const fChildren = DOMTodo.footer.children;
                let DOMTodoTag;
                for (let j = i; j < tags.length; j += 1) {
                    todo.tags[j] = tags[j];

                    if (j < todo.tags.length) {
                        fChildren[j].title = "tag: " + tags[j];
                        fChildren.firstElementChild.textContent = tags[j];
                        TodosDOM.fragment.appendChild(fChildren[j]);
                    } else {
                        DOMTodoTag = TagsMethods.createDOMTodoTag(tags[j]);
                        TodosDOM.fragment.appendChild(DOMTodoTag);
                    }
                }
                if (tags.length < todo.tags.length) {
                    todo.tags.length = tags.length;
                }
                Element.prototype.replaceChildren.apply(
                    DOMTodo.footer,
                    TodosDOM.fragment.children
                );
            }
        }
        if (ischanged) {
            localStorage.setItem(`todo.${id}`, JSON.stringify(todo));
        }
    },
    /**
    @type {(id: string) => undefined} */
    remove(id) {
        const ids = TodosState.ids;
        const i = ids.indexOf(id);
        if (i === -1) {
            //We assume that the todo does not exist
            return;
        }
        if (i !== ids.length - 1) {
            ids.copyWithin(i, i + 1, ids.length);
        }
        ids.pop();
        const DOMTodo = TodosDOM.todos[id];

        TagsMethods.remove(TodosState.todos[id].tags);

        delete TodosState.todos[id];
        delete TodosDOM.todos[id];

        TodosMethods.removeSelected(id);

        //Remove the dom element from Document
        TodosDOM.root.removeChild(DOMTodo);

        localStorage.removeItem(`todo.${id}`);
        localStorage.setItem("todo.ids", JSON.stringify(TodosState.ids));
    },
    /**
    @type {(id: string) => boolean} */
    removeSelected(id) {
        const selected = TodosState.selected;
        let i = selected.indexOf(id);
        if (i === -1) {
            return false;
        }
        if (i !== selected.length - 1) {
            selected.copyWithin(i, i + 1, selected.length);
        }
        selected.pop();

        const DOMTodo = TodosDOM.todos[id];
        if (DOMTodo !== undefined) {
            DOMTodo.setAttribute("data-display", "0");
        }
        return true;
    },
    /**
    @type {(id: string) => undefined} */
    toggleCompleted(id) {
        const todo = TodosState.todos[id];
        if (todo === undefined) {
            return;
        }
        todo.completed = !todo.completed;
        localStorage.setItem(`todo.${id}`, JSON.stringify(todo));

        const DOMTodo = TodosDOM.todos[id];
        if (DOMTodo === undefined) {
            throw Error("DOMTodo is undefined when it must not be");
        }
        TodosMethods.setDOMTodoComplete(DOMTodo, todo.completed);

        if (
            (todo.completed && FilterState.status === "active")
            || (!todo.completed && FilterState.status === "completed")
        ) {
            TodosMethods.removeSelected(id);
        }
    },
    /**
    @type {(DOMTodo: DOMTodo, completed: boolean) => undefined} */
    setDOMTodoComplete(DOMTodo, completed) {
        if (completed) {
            DOMTodo.setAttribute("data-completed", "1");
            DOMTodo.buttonToggle.title= "mark as no completed";
        } else {
            DOMTodo.setAttribute("data-completed", "0");
            DOMTodo.buttonToggle.title = "mark as completed";
        }
    }
 };

const FilterMethods = {
    /**
    @type {() => undefined} */
    clearCompleted() {
        const TSIds = TodosState.ids;
        let tr = -1;
        for (let i = 0; i < TSIds.length; i += 1) {
            let id = TSIds[i];
            const todo = TodosState.todos[id];
            if (todo.completed) {
                const DOMTodo = TodosDOM.todos[id];

                TagsMethods.remove(todo.tags);
                delete TodosState.todos[id];
                delete TodosDOM.todos[id];

                TodosDOM.root.removeChild(DOMTodo);
                localStorage.removeItem(`todo.${id}`);
                if (tr === -1) {
                    tr = i;
                }
            } else {
                if (tr !== -1) {
                    TSIds[tr] = TSIds[i];
                    tr += 1;
                }
            }
        }
        if (tr === -1) {
            return;
        }
        TSIds.length = tr;
        localStorage.setItem("todo.ids", JSON.stringify(TSIds));
        //selected
        switch (FilterState.status) {
            case "active": return;
            case "completed": {
                TodosState.selected.length = 0;
                return;
            }
            default: {
                const TSSelected = TodosState.selected;
                tr = -1;
                for (let i = 0; i < TSSelected.length; i += 1) {
                    const id = TSSelected[i];
                    if (TodosState.todos[id] === undefined) {
                        if (tr === -1) {
                            tr = i;
                        }
                    } else {
                        if (tr !== -1) {
                            TSSelected[tr] = TSSelected[i];
                            tr += 1;
                        }
                    }
                }
                if (tr !== -1) {
                    TSSelected.length = tr;
                }
            }
        }
    },
    /**
    @type {() => undefined} */
    completeAll() {
        let ischanged = false;
        for (let i = 0; i < TodosState.ids.length; i += 1) {
            let id = TodosState.ids[i];
            let todo = TodosState.todos[id];
            if (!todo.completed) {
                ischanged = true;
                todo.completed = true;
                localStorage.setItem(`todo.${id}`, JSON.stringify(todo));

                let DOMTodo = TodosDOM.todos[id];
                if (FilterState.status === "active") {
                    DOMTodo.setAttribute("data-desplay", "0");
                }
                TodosMethods.setDOMTodoComplete(DOMTodo, true);
            }
        }
        if (!ischanged) {
            return;
        }
        switch (FilterState.status) {
            case "all": return;
            case "active": {
                TodosState.selected.length = 0;
            };break;
            default: {
                FilterMethods.selectTodos();
            }
        }
    },
    /**
    @type {(color: Colors, add: boolean) => undefined} */
    changeColor(color, add) {
        if (FilterState.colors.length > 0) {
            const i = FilterState.colors.indexOf(color);
            if (add) {
                if (i !== -1) {
                    return;
                }
                FilterState.colors.push(color);
                //we need to run selector
                FilterMethods.selectTodos();
            } else {
                if (i === -1) {
                    return;
                }
                FilterState.colors[i] = (
                    FilterState.colors[FilterState.colors.length - 1]
                );
                FilterState.colors.pop();
                //remove color from selected
                if (FilterState.colors.length > 0) {
                    let head = 0;
                    const TSSelected = TodosState.selected;
                    for (let i = 0; i < TSSelected.length; i += 1) {
                        let id = TSSelected[i];
                        let todo = TodosState.todos[id];
                        if (color !== todo.color) {
                            TSSelected[head] = TSSelected[i];
                            head += 1;
                        } else {
                            let DOMTodo = TodosDOM.todos[id];
                            DOMTodo.setAttribute("data-display", "0");
                        }
                    }
                    TSSelected.length = head;
                } else {
                    FilterMethods.selectTodos();
                }
            }
        } else {
            if (add) {
                //add color from selected
                const TSSelected = TodosState.selected;
                let head = 0;
                for (let i = 0; i < TSSelected.length; i  += 1) {
                    let id = TSSelected[i];
                    let todo = TodosState.todos[id];
                    if (color === todo.color) {
                        TSSelected[head] = id;
                        head += 1;
                    } else {
                        let DOMTodo = TodosDOM.todos[id];
                        DOMTodo.setAttribute("data-display", "0");
                    }
                }
                TSSelected.length = head;
                FilterState.colors.push(color);
            }
        }
    },
    /**
    @type {(status: FilterStatus) => undefined} */
    changeStatus(status) {
        if (status === FilterState.status) {
            return;
        }
        FilterState.status = status;
        FilterMethods.selectTodos();
    },
    
    /**
    @type {(color: Colors) => boolean} */
    includeColor(color) {
        /**@type {Colors}*/
        let fcolor;
        for (let i = 0; i < FilterState.colors.length; i += 1) {
            fcolor = FilterState.colors[i];
            if (color === fcolor) {
                return true;
            }
        }
        return false;
    },
    /**
    @type {(tags: ref<Array<string>>) => boolean} */
    includeTags(tags) {
        let end = tags.length;
        if (end < FilterState.tags.length) {
            return false;
        }
        let ctag = "";
        let ftag = "";
        outer:
        for (let j = 0; j < FilterState.tags.length; j += 1) {
            ftag = FilterState.tags[j];;
            for (let i = 0; i < end; i += 1) {
                ctag = tags[i];
                if (ctag === ftag) {
                    tags[i] = tags[end - 1];
                    tags[end - 1] = ctag;
                    end -= 1;
                    continue outer;
                }
            }
            return false;
        }
        return true;
    },
    /**
    @type {() => undefined} */
    selectTodos() {
        const TSSelected = TodosState.selected;
        const TSIds = TodosState.ids;
        if (FilterState.status === "all") {
            for (let i = 0; i < TSIds.length; i += 1) {
                TSSelected[i] = TSIds[i];
            }
        } else {
            const hasToBeComplete = FilterState.status === "completed";
            let head = 0;
            for (let i = 0; i < TSIds.length; i += 1) {
                let id = TSIds[i];
                if (TodosState.todos[id].completed === hasToBeComplete) {
                    TSSelected[head] = id;
                    head += 1;
                } else {
                    let DOMTodo = TodosDOM.todos[id];
                    DOMTodo.setAttribute("data-display", "0");
                }
            }
            if (head < TSSelected.length) {
                TSSelected.length = head;
            }
        }
        const FColors = FilterState.colors;
        if (FColors.length > 0) {
            let head = 0;
            for (let i = 0; i < TSSelected.length; i += 1) {
                let id = TSSelected[i];
                let todo = TodosState.todos[id];
                for (let j = 0; j < FColors.length; j += 1) {
                    if (todo.color === FColors[j]) {
                        TSSelected[head] = id;
                        head += 1;
                        break;
                    }
                }
                let DOMTodo = TodosDOM.todos[id];
                DOMTodo.setAttribute("data-display", "0");
            }
            TSSelected.length = head;
        }
        const Ftags = FilterState.tags;
        if (Ftags.length > 0) {
            let head = 0;
            let i = 0;
            while (i < Ftags.length && TSSelected.length > 0) {
                const ftag = Ftags[i];
                for (let j = 0; j < TSSelected.length; j += 1) {
                    const id = TSSelected[j];
                    const ttags = TodosState.todos[id].tags;
                    for (let k = 0; k < ttags.length; k += 1) {
                        const ttag = ttags[k];
                        if (ttag === ftag) {
                            TSSelected[head] = id;
                            head += 1;
                            break;
                        }
                    }
                    let DOMTodo = TodosDOM.todos[id];
                    DOMTodo.setAttribute("data-display", "0");
                }
                TSSelected.length = head;
                i += 1;
            }
        }
        for (let i = 0; i < TSSelected.length; i += 1) {
            let id = TSSelected[i];
            const DOMTodo = TodosDOM.todos[id];
            DOMTodo.setAttribute("data-display", "1");
        }
    }
};

const TagsMethods = {
    /**
    @type {(tag: string) => DOMButtonTag} */
    createDOMButtonTag(tag) {
        const DOMButtonTag = (
            TagsDOM
            .templateButtonTag
            .content
            .cloneNode(true)
            .firstElementChild
        );
        DOMButtonTag.title = `tag: ${tag}`;
        DOMButtonTag.name = tag;
        DOMButtonTag.setAttribute("data-value", tag);
        DOMButtonTag.firstElementChild.textContent = tag;
        return DOMButtonTag;
    },
    /**
    @type {(tag: string) => DOMTodoTag} */
    createDOMTodoTag(tag) {
        const DOMTodoTag = (
            TagsDOM
            .templateTodotag
            .content
            .cloneNode(true)
            .firstElementChild
        );
        DOMTodoTag.title = "tag: " + tag;
        DOMTodoTag.firstElementChild.textContent = tag;
        return DOMTodoTag;
    },
    /**
    @type {(tags: ref<Array<string>>, i?: maybe<number>) => undefined} */
    add(tags, i) {
        if (i === undefined) {
            i = 0;
        }
        let tag = "";
        while (i < tags.length) {
            tag = tags[i];
            if (TagsState.counter[tag] !== undefined) {
                TagsState.counter[tag] += 1;
            } else {
                TagsState.counter[tag] = 1;
            }
            i += 1;
        }
    },
    /**
    @type {(tags: ref<Array<string>>, i?: maybe<number>) => undefined} */
    remove(tags, i) {
        if (i === undefined) {
            i = 0;
        }
        let tag = "";
        while (i < tags.length) {
            tag = tags[i];
            if (TagsState.counter[tag] !== undefined) {
                TagsState.counter[tag] -= 1;
                if (TagsState.counter[tag] === 0) {
                    delete TagsState.counter[tag];
                }
            }
            i += 1;
        }
    }
};

export {
    DateTimeFormatter,
    TodosState,
    TodosDOM,
    FilterState,
    TagsState,
    TodosMethods,
    FilterMethods,
    TagsMethods
};

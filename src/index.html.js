import html_head from "./components/head.html.js";
import html_header from "./components/header.html.js";
import html_footer from "./components/footer.html.js";
import html_modal_todo from "./components/modal-todo.html.js";
import html_modal_init from "./components/modal-init.html.js";
import html_modal_filter from "./components/modal-filter.html.js";
import html_template_todo from "./components/template-todo.html.js";
import {
    html_template_todo_tag,
    html_template_button_tag
} from "./components/template-tags.html.js";

const index = /*html*/`
<!DOCTYPE html>
<html lang="es">
${html_head(Bun.env.NODE_ENV === "production")}
<body class="light">
    <h1 class="visual-hidden">Vanilla Todo App</h1>
    ${html_header}
    <div class="main-body">
        <main id="main"></main>
        <aside id="aside_filter"></aside>
    </div>
    ${html_footer}
    ${html_modal_todo}
    ${html_modal_filter}
    ${html_modal_init}
    ${html_template_todo}
    ${html_template_todo_tag}
    ${html_template_button_tag}
</body>
</html>
`;

export default index;

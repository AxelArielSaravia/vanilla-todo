import {
    html_modal_button_close,
    html_modal_button_complete
} from "./modal_buttons.html.js";

const html_modal_init = `
<div
    id="modal_init"
    class="modal"
>
    <div>
        ${html_modal_button_close(
            /*id*/ "modal_init-button-close"
        )}
        <section class="section">
            <h3>Hello</h3>
            <div class="section">
                <p>I am Axel Ariel Saravia.</p>
                <p>I create this ToDo app for fun.</p>
                <p>Enjoy it.</p>
            </div>
            <hr/>
            <section class="section">
                <h4>Features:</h4>
                <ul class="section">
                    <li>
                        <p>Use <strong>only</strong> HTML, CSS and vanilla JS</p>
                    </li>
                    <li>
                        <p>
                            Minimalist and responsive design
                        </p>
                    </li>
                    <li>
                        <p>
                            Use the browser local storage
                            (I don't keeps your data)
                        </p>
                    </li>
                </ul>
            </section>
        </section>
        ${html_modal_button_complete(
            /*text*/ "don't show again",
            /*id*/ "modal_init-button-complete",
        )}
    </div>
</div>
`;

export default html_modal_init;

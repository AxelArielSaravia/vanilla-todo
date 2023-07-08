{
    /**
    @type {(OnClickHandler<HTMLButtonElement>)} */
    function closeInitModal() {
        document.getElementById("modal_init")?.remove();
    }

    /**
    @type {(this: GlobalEventHandlers, ev: MouseEvent) => any} */
    function completeInit() {
        localStorage.setItem("show-init", "false");
        document.getElementById("modal_init")?.remove();
    }

    const show = localStorage.getItem("show-init");
    if (show !== "false") {
        const closeButton = document.getElementById("modal_init-button-close");
        const completeButton = (
            document.getElementById("modal_init-button-complete")
        );
        if (closeButton !== null && completeButton !== null) {
            closeButton.onclick = closeInitModal;
            completeButton.onclick = completeInit;
        }
        if (show === undefined) {
            localStorage.setItem("show-init", "true");
        }
    } else {
        document.getElementById("modal_init")?.remove();
    }
}

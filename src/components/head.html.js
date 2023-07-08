/**
@type {(isProduction: boolean) => string} */
function html_head(isProduction) {
    return /*html*/`
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#cfbcbc"
    />
    <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#2e2929"
    />
    <meta
        name="description"
        content="Vanilla todo app"
    />
    <meta
        name="keywords"
        content="todo, todo-list, react, javascript"
    >
    <meta name="author" content="Axel Ariel Saravia">
    <meta name="creator" content="axarisar"> 
    <meta name="ranting" content="general">
    <meta name="canonical" href="https://aas-vanilla-todo.web.app">

    <!--  SOCIAL MEDIA meta tags -->
    <meta property="og:title" content="Vanilla todo app">
    <meta property="og:description" content="Minimalistic todo app in vanilla js">
    <meta property="og:type" content="profile"/>
    <meta property="og:url" content="">
    <meta property="og:image" content="/icon/192.png"/>
    <meta property="og:image:secure_url" content="/icon/192.png"/>
    <meta property="og:image:alt" content="todo"/>
    <meta name="twitter:card" content="summary_large_image"/>

    <link rel="icon" href="/icon/512.png" />
    <link rel="apple-touch-icon" href="/apple-180.png" />
    <link rel="manifest" href="/app.webmanifest" />

    <title>Vanilla todo app</title>
    <link rel="stylesheet" href="/style.css" />
    <script
        src="/main.js"
        ${isProduction ? 'type="module"' : "defer"}
    >
    </script>
</head>
`;
}

export default html_head;

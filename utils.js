/**
@type {(s: string) => string} */
function HTMLMinify(s) {
    let str = "";
    let prevChar = "";
    let fst = -1;
    let i = 0;
    while (i < s.length && prevChar !== "<") {
        if (s[i] === "<") {
            prevChar = s[i];
        } else {
            i += 1;
        }
    }
    if (i === s.length) {
        return str;
    }
    fst = i;
    for (; i < s.length; i += 1) {
        if (fst !== -1) {
            if (s[i] === ">") {
                str += s.substring(fst, i + 1);
                fst = -1;
                prevChar = ">"
            } else if (s[i] === "\n") {
                str += s.substring(fst, i);
                if (prevChar === "<" && str[str.length - 1] !== " ") {
                    str += " ";
                }
                fst = -1;
                if (prevChar !== ">") {
                    prevChar = "";
                }
            } else if (s[i] === "<") {
                str += s.substring(fst, i);
                fst = i;
                prevChar = "<"
            }
        } else {
            if (s[i] !== " " && s[i] !== "\n") {
                if (prevChar === ">") {
                    fst = i;
                    prevChar = s[i];
                } else if (prevChar === "") {
                    if (
                        s[i] !== ">"
                        && s[i] !== "<"
                        && str[str.length - 1] !== " "
                    ) {
                        str += " ";
                    }
                    fst = i;
                    prevChar = s[i];
                }
            }
        }
    }
    return str;
}

export {
    HTMLMinify
};

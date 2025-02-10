const removeTrailingNewlines = (str) => {
    return str.replace(/\n+$/, "");
}

export { removeTrailingNewlines };
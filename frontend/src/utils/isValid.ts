export function isValid(x: any) {
    if (x === undefined) return false;
    if (x === null) return false;
    if (x instanceof Array && x.length === 0) return false;

    return true;
}

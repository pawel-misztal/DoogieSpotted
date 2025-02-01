export function dateToHtmlString(date: Date | string | null): string {
    if (!date) return "";

    console.log(date);
    let isoDate = "";
    if (date instanceof Date) isoDate = date.toISOString();
    else isoDate = date;

    if (isoDate === "") return isoDate;
    const dateString = isoDate.split("T")[0];
    return dateString;
}

export function htmlToDateOrNull(dateString: string) {
    if (!dateString) return null;

    const dateNumber = Date.parse(dateString);
    if (Number.isNaN(dateNumber)) return null;

    return new Date(dateNumber);
}

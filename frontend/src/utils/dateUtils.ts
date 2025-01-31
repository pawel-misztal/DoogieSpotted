export function dateToHtmlString(date: Date | null): string {
    if (!date) return "";

    console.log(date);
    const isoDate = date.toISOString();
    const dateString = isoDate.split("T")[0];
    return dateString;
}

export function htmlToDateOrNull(dateString: string) {
    if (!dateString) return null;

    const dateNumber = Date.parse(dateString);
    if (Number.isNaN(dateNumber)) return null;

    return new Date(dateNumber);
}

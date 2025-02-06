export function calculateAge(birthDatestr: string | undefined): number {
    if (!birthDatestr || birthDatestr === "") {
        return 0;
    }
    const birthDate = new Date(birthDatestr);

    console.log(birthDate);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

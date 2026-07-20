

export class TextUtil{
    static normalizeText(str) {
        return str
            ?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "d")
            ?? "";
    }
}
export function toInput(date: Date = new Date()) {
    return date.toISOString().substr(0,10)
}

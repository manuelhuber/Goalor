export function serialise(date: Date = new Date()) {
    return date.toISOString().substr(0,10)
}

import {
    FaMinus,
    MdCheck,
    MdSentimentDissatisfied,
    MdSentimentNeutral,
    MdSentimentSatisfied,
    MdSentimentVeryDissatisfied,
    MdSentimentVerySatisfied,
    MdThumbDown,
    MdThumbUp
} from "react-icons/all";

export type OptionEntry = { value: number, icon: any }
export const OptionsMap: { [key: string]: { description: string, entries: OptionEntry[] } } = {
    "1": {
        description: "Check-in",
        entries: [
            {"value": 1, icon: MdCheck}
        ]
    },
    "2": {
        description: "Yes/No",
        entries: [
            {"value": -1, icon: MdThumbDown},
            {"value": 1, icon: MdThumbUp}
        ]
    },
    "3": {
        description: "Yes/No/Nothing",
        entries: [
            {"value": -1, icon: MdThumbDown},
            {"value": 0, icon: FaMinus},
            {"value": 1, icon: MdThumbUp},
        ]
    },
    "4": {
        description: "Scale (no neutral option)",
        entries: [
            {"value": -2, icon: MdSentimentVeryDissatisfied},
            {"value": -1, icon: MdSentimentDissatisfied},
            {"value": 1, icon: MdSentimentSatisfied},
            {"value": 2, icon: MdSentimentVerySatisfied},
        ]
    },
    "5": {
        description: "Scale (with neutral option)",
        entries: [
            {"value": -2, icon: MdSentimentVeryDissatisfied},
            {"value": -1, icon: MdSentimentDissatisfied},
            {"value": 0, icon: MdSentimentNeutral},
            {"value": 1, icon: MdSentimentSatisfied},
            {"value": 2, icon: MdSentimentVerySatisfied},
        ]
    }
};

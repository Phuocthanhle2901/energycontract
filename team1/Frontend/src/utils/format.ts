import { capitalize } from "lodash";

export function formatStatus(status: string) {
    return capitalize(status.replace("_", " "));
}

import { debounce } from "lodash";

export const debounceSearch = debounce((fn: Function) => fn(), 300);

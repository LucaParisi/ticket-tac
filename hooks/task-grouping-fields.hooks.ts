import {TASK_GROUPING_LABLE_TO_FIELDS_MAP} from "@constants";

export function getTaskGroupingByFieldByLabel(label: string): string {
    return TASK_GROUPING_LABLE_TO_FIELDS_MAP.get(label);
}
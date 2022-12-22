export interface Item {
    Time: Date;
    Count: number;
}

export interface Current {
    Total: number;
    Items: Item[];
}

export interface Item2 {
    Time: Date;
    Count: number;
}

export interface Previous {
    Total: number;
    Items: Item2[];
}

export interface SummaryOrderDTO {
    Current: Current;
    Previous: Previous;
}
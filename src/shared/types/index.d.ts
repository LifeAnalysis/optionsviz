export interface OptionEntry {
    option_type: 'call' | 'put';
    strike_price: number;
    expiry_date: string;
    size: number;
    created_at?: string;
}
export interface OptionResponse extends OptionEntry {
    id: number;
    created_at: string;
}
export interface PriceData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
export interface OHLCVResponse {
    symbol: string;
    data: PriceData[];
    source: string;
    last_updated: string;
}
export interface ApiResponse<T = unknown> {
    message?: string;
    data?: T;
    error?: string;
}
export interface CreateOptionResponse {
    id: number;
    message: string;
}
export type RawOHLCVEntry = [
    number,
    number,
    number,
    number,
    number,
    number
];
export interface OptionDBRow {
    id: number;
    option_type: string;
    strike_price: number;
    expiry_date: string;
    size: number;
    created_at: string;
}
//# sourceMappingURL=index.d.ts.map

export interface Address {
    street_1: string;
    city: string;
    postal_code: string;
    state: string;
    country: string;
}

export interface Summary {
    subtotal: number;
    shipping_cost: number;
    total_tax: number;
    total_cost: number;
}

export interface Adjustment {
    name: string;
    amount: number;
}

export interface Payload {
    template_type: string;
    recipient_name: string;
    order_number: string;
    currency: string;
    payment_method: string;
    order_url: string;
    address: Address;
    summary: Summary;
    adjustments: Adjustment[];
    elements: any[];
}

export interface Attachment {
    type: string;
    payload: Payload;
}

export interface MessagePayloadDto {
    attachment: Attachment;
}



export interface User {
    email: string;
    name: string;
    password?: string;
}

export interface Chef {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    image: string;
}

export interface Review {
    id: number;
    chefId: number;
    userId: string;
    text: string;
    rating: number;
    createdAt?: Date;
}

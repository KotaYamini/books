export interface Books {
    data: Data;
    status: string;
}

export interface Data {
    author: string;
    birthday: string;
    birthPlace: string;
    books: Book[];
}

export interface Book {
    imageUrl: string;
    title: string;
    purchaseLink: string;
    PublishDate: string;
}

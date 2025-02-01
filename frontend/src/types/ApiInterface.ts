import { IListingSchema } from "@/models/listing";
import { LoanStatus } from "@/models/loan";
import { IUserSchema } from "@/models/user";

export interface Listing extends IListingSchema {

}

export interface Loan {
    _id: string;
    forAddress: string;
    address: string;
    coin: string;
    amount: number;
    duration: number;
    apr: number;
    offer_obj: string;
    hash: string; 
    forListing: Listing;
    status: LoanStatus;
    start_timestamp: number | null;
    borrow_obj: string | null;
}
export interface User extends IUserSchema {
    _id: string
}
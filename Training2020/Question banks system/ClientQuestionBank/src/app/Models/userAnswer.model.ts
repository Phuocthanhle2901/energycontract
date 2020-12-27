import { ListQuestion } from "./listQuestion.model";

export class UserAnswer{
    Id:string;
    Email:string;
    ListQuestion:ListQuestion[];
    Summary:number;
    Date:Date
}
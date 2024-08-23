import {Request} from "express";
import { User } from "../entities/user-entity";

export interface AuthRequest extends Request {
    auth?: User
}
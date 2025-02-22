import { Request, Response } from "express";
import { User } from "../models/User";
import { Error as MongooseError } from "mongoose";
import bcrypt from "bcrypt";
const { ValidationError } = MongooseError;

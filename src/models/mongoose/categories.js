import { Schema, model } from 'mongoose';

const categoryModel = new Schema({
    name: { type: String, required: true, unique: true }
});

export const Category = model('categories', categoryModel);

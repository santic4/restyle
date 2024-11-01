import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const schemaProduct = new Schema ({
    _id: { type: String, required: true },
    title: {
      type: String,
      required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    images: {
        type: [String], 
        required: true
    },
    colors: {
        type: [String] 
    },
    tails: {
        type: [String], 
    },
    stock: { type: Number,
        default: 0 
    },
}, {
    strict: 'throw',
    versionKey: false,
})

schemaProduct.plugin(mongoosePaginate)

export const Product = model('products', schemaProduct)
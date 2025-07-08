"use client"

import api from "@/api";
import { BookType } from "@/types/bookType";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().required('Title is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  description: yup.string().required('Description is required'),
  image: yup.string().url('Enter a valid image URL').required('Image URL is required'),
});

const AddBook = ()=> {

    const [newBook, setNewBook] = useState<BookType>({
        _id: "",
        title: "",
        author: "",
        seller: "",
        price: 0,
        image: "",
        stock: 0,
        description: ""
    })

    const { register, handleSubmit, formState: {errors}, reset }= useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = ( data : any )=>{
        const formData =  new FormData()
        api.post('/books/add', data);
    }

    return(
        <div></div>
    )
}

export default AddBook;
import { uri } from "@/config"
import axios from "axios"

export class List {
    public getAll = async () => {
        let { data } = await axios.get(`${uri}/list`)

        return data
    }

    public confirmList = async (id: number) => {
        let { data } = await axios.patch(`${uri}/list`, {
            id: id,
        })

        return data
    }


    public InsertList = async (product: string, from: string, department: string, sender: string, qty: number) => {
        let { data } = await axios.post(`${uri}/list`, {
            product: product,
            from: 'GR',
            department: department,
            sender: sender,
            qty: qty
        })

        return data
    }


    public deleteList = async (id: number) => {
        let { data } = await axios.delete(`${uri}/list/${id}`)

        return data
    }
}
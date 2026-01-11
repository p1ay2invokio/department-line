'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { List } from "./methods/list.method";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/th'
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

dayjs.extend(utc)
dayjs.extend(timezone)

export default function Home() {

  let [modal, setModal] = useState(false)

  let [lists, setLists] = useState([])
  let [refresh, setRefresh] = useState(0)


  let [product, setProduct] = useState('')
  let [sender, setSender] = useState('')
  let [from, setFrom] = useState('')
  let [department, setDepartment] = useState('')


  let date = new Date()

  useEffect(() => {
    (async () => {
      let ls = new List()

      let data = await ls.getAll()
      console.log(data)


      setLists(data)
    })()
  }, [refresh])


  return (
    <div className="p-5">

      {modal ? <div onClick={(e) => {
        if (e.target == e.currentTarget) {
          setModal(false)
        }

      }} className="w-full h-full bg-black/60 fixed left-0 top-0 flex justify-center items-center">
        <div className="w-[300px] rounded-xl bg-white p-5 gap-2 flex flex-col">
          <p className="font-[medium]">GR ตรวจรับสินค้า</p>
          <div>

            <label className="font-[regular]">สินค้า</label>
            <input onChange={(e) => {
              setProduct(e.target.value)
            }} className="w-full indent-3 font-[regular] h-[45px] border rounded-md border-gray-300"></input>
          </div>

          <div>
            <label className="font-[regular]">พนักงาน</label>
            <input onChange={(e) => {
              setSender(e.target.value)
            }} className="w-full h-[45px] indent-3 font-[regular] border rounded-md border-gray-300"></input>
          </div>

          {/* <div>
            <label className="font-[regular]">แผนกที่ส่ง</label>
            <input onChange={(e) => {
              setFrom(e.target.value)
            }} className="w-full h-[45px] indent-3 font-[regular] border rounded-md border-gray-300"></input>
          </div> */}

          <div>
            <label className="font-[regular]">แผนกที่รับ</label>
            <input onChange={(e) => {
              setDepartment(e.target.value)
            }} className="w-full h-[45px] indent-3 font-[regular] border rounded-md border-gray-300"></input>
          </div>



          {from || department ? <p className="font-[medium]">แผนก GR {`->`} แผนก{department}</p> : null}


          <button onClick={async () => {
            if (product && sender && department) {
              let ls = new List()

              let res = await ls.InsertList(product, from, department, sender)

              if (res.success) {
                setRefresh(refresh + 1)
                Swal.fire(`จัดส่ง ${product} เสร็จเรียบร้อย!`)
                setProduct('')
                setFrom('')
                setSender('')
                setDepartment('')
                setModal(false)
              }
            } else {
              toast.error("กรุณาใส่ข้อมูลให้ครบถ้วน!")
            }
          }} className="w-full h-[45px] bg-blue-400 rounded-md font-[medium] text-white">เพิ่มข้อมูล</button>
        </div>
      </div> : null}

      <div className="flex justify-between">
        <p className="font-[medium] text-2xl">สถานะการรับสินค้า</p>
        <p onClick={() => {
          setModal(true)
        }} className="font-[bold] cursor-pointer text-blue-400">+ เพิ่ม</p>
      </div>

      <div className="gap-5 flex flex-col mt-5">

        {lists && lists.length > 0 ? lists.map((item: any) => {
          return (
            <div key={item.id} className="w-full p-2 rounded-xl border border-gray-300 relative shadow">
              <div className="flex justify-between">
                <p className="font-[medium] text-[18px]">{item.id}.{item.product}</p>
                <div className="flex flex-col items-end">
                  <p className="font-[medium] text-[18px]">{item.sender}</p>
                  <p className="font-[regular] text-[14px] text-gray-500">{dayjs().diff(item.createdAt, 'minutes')} นาทีที่ผ่านมา</p>
                </div>
              </div>
              <p className="font-[regular] text-gray-500">GR {`->`} PC แผนก {item.department}</p>
              <p className="font-[regular] text-gray-500">{dayjs.utc(item.createdAt).tz("Asia/Bangkok").format("DD/MM/YYYY HH:mm")}</p>
              <div className="gap-2 flex">
                <button className={`pl-2 pr-2 h-[30px]  mt-2 text-white font-[regular] ${item.status == 0 ? "bg-red-700/70" : "bg-green-700/70"} rounded-md`}>{item.status == 0 ? "รอการรับสินค้า" : item.status == 1 ? "สำเร็จ" : ''}</button>
                {item.status == 0 ? <button onClick={async () => {

                  Swal.fire({
                    title: "ยืนยันการรับสินค้า",
                    showCancelButton: true,
                    confirmButtonText: "ยืนยัน",
                    cancelButtonText: 'ยกเลิก',

                  }).then(async (res) => {
                    if (res.isConfirmed) {
                      let ls = new List()

                      let res = await ls.confirmList(item.id)

                      toast.success("ยืนยันการรับของสำเร็จ!")

                      setRefresh(refresh + 1)

                      console.log(res)
                    }
                  })
                }} className="w-[70px] h-[30px] bg-orange-700/70 mt-2 text-white font-[regular] rounded-md">รับสินค้า</button> : null}
              </div>
              <button onClick={async () => {
                Swal.fire({
                  title: "ต้องการลบรายการ?",
                  showCancelButton: true,
                  confirmButtonText: "ยืนยัน",
                  cancelButtonText: 'ยกเลิก',
                }).then(async (res) => {
                  if (res.isConfirmed) {
                    let ls = new List()

                    let data = await ls.deleteList(item.id)

                    if (data.success) {
                      Swal.fire("ลบรายการเสร็จสิ้น!")
                      setRefresh(refresh + 1)
                    }
                  }
                })
              }} className={`pl-2 pr-2 h-[30px]  mt-2 absolute bottom-2 right-2 text-white font-[regular] bg-black rounded-md`}>ลบ</button>

            </div>

          )
        }) : null}

      </div>


      <Toaster position="bottom-center"></Toaster>
    </div>
  );
}

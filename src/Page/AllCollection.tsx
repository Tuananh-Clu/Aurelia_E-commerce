import { useNavigate } from "react-router-dom"
import { Navbar } from "../Components/HomeComponent/Navbar"
import data from "../assets/DataMock/dataSeason.json";

export const AllCollection = () => {
    const navigate=useNavigate()
     const collection = data.luxury_women_collections;
  return (
    <>
     <Navbar/>   
     <div>
        {collection.map(item=>{
            return(
                <div className="relative">
                    <img className="w-full" src={item.banner} alt="" />
                    <div className="absolute inset-0 z-5 w-full bg-black/15 hover:bg-transparent transition duration-300 h-full text-center flex flex-col items-center justify-center">
                        <h1 className="text-5xl text-white font-semibold ">{item.name}</h1>
                        <h1 className="text-gray-400 mt-2">{item.slogan}</h1>
                        <button onClick={()=>navigate(`/Collection/${item.id}`)} className="mt-2 bg-gray-500 backdrop-blur-3xl p-4 text-white cursor-pointer ">Tìm Hiểu Thêm</button>
                    </div>
                </div>
            )
        })}
     </div>
    </>
  )
}

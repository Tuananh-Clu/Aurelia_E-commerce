import { useEffect, useState } from 'react'
import { Navbar } from '../HomeComponent/Navbar'
import { LeftSite } from './LeftSite'
import { RightSiteMap } from './RightSiteMap'

import { useParams } from 'react-router-dom'
import axios from 'axios'
import { api_Config, UseApiUrl } from '../../types/api'
import type { order } from '../../types/type'

export const MainPage = () => {
  const {id}=useParams()
  const [data,setData]=useState<order>()
  useEffect(()=>{
    const fetch=async()=>{
      const data=await axios.get(`${UseApiUrl(api_Config.Shop.LayDonHangTheoID)}?id=${id}`)
      setData(data.data)
    }
    fetch()
  },[id])
  return (
    <div className="mt-11 w-full  flex  items-center justify-around">
      <Navbar />
        <LeftSite data={data} />
        <RightSiteMap  data={data} />
    </div>
  );
};

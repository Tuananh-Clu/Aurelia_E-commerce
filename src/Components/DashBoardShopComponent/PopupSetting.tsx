import  { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from '../../contexts/NotifycationContext'
import { AuthForShopContext } from '../../contexts/AuthorForShop'

export const PopupSetting = () => {
    const {logOut}=useContext(NotificationContext)
    const {setIsignned}=useContext(AuthForShopContext)
    const navigate=useNavigate()
    const token=localStorage.getItem('tokenShop') 
    const handleLogOut = () => {
        logOut();
        setIsignned(false)
        if(token){
            localStorage.removeItem('tokenShop');
        }
        navigate('/loginShop');
    }
  return (
    <div className='absolute bottom-20 bg-white  text-black p-4 rounded shadow-lg w-50 flex flex-col items-center '>
        <h1 className='font-bold hover:bg-gray-600 px-12 py-2'>Setting</h1>
        <button className='mt-2 hover:bg-red-700 px-12 py-2 rounded font-bold' onClick={handleLogOut}>Log out</button>
    </div>
  )
}

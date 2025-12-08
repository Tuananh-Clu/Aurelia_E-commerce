import axios from "axios";
import { createContext,  useEffect,  useState } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";

type CollectionContextType = {
    seasonCollections: any;
    collectionData: any[];
    statCollection?: any;
    handleAddCollection: (newCollection: any) => Promise<void>;
    fetchData: (id: string) => Promise<void>;
    handleUpdateCollection: (updatedCollection: any) => Promise<void>;
    handleDeleteCollection: (id: string) => Promise<void>;
};
export const CollectionContext = createContext<CollectionContextType>({
    seasonCollections: [],
    collectionData: [],
    statCollection: undefined,
    handleAddCollection:async ()=> {},
    fetchData: async () => {},
    handleUpdateCollection: async ()=> {},
    handleDeleteCollection: async ()=> {},
});
export const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [seasonCollections, setSeasonCollections] = useState<any>();
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [statCollection, setStatCollection] = useState<any>();
  const [update,setUpdate]=useState<boolean>(false);
    const handleAddCollection = async(newCollection: any) => {
      try{
        await axios.post(UseApiUrl(api_Config.Collection.AddCollection), newCollection,{headers:{'Content-Type':'application/json'}});
        setUpdate(!update);
        Toaster.success("Đã thêm collection thành công!");
      }
      catch(error){
        console.error('Error adding new collection:', error);
        Toaster.error("Không thể thêm collection. Vui lòng thử lại.");
      }
    };

    const handleUpdateCollection = async(updatedCollection: any) => {
      try{
       await axios.put(UseApiUrl(api_Config.Collection.UpdateCollection), updatedCollection,{headers:{'Content-Type':'application/json'}});
        setUpdate(!update);
        Toaster.success("Đã cập nhật collection thành công!");
      }
      catch(error){
        console.error('Error updating collection:', error);
        Toaster.error("Không thể cập nhật collection. Vui lòng thử lại.");
      }
    };

    const handleDeleteCollection = async(id: string) => {
      try{
       await axios.delete(`${UseApiUrl(api_Config.Collection.DeleteCollection)}?collectionId=${id}`);
        setUpdate(!update);
        Toaster.success("Đã xóa collection thành công!");
      }
      catch(error){
        console.error('Error deleting collection:', error);
        Toaster.error("Không thể xóa collection. Vui lòng thử lại.");
      }
    };
  useEffect(() => {
    Promise.all([
      axios.get(UseApiUrl(api_Config.Collection.getallcollections)),
      axios.get(UseApiUrl(api_Config.Collection.GetStat))
    ])
    .then(([collectionsResponse, statResponse]) => {
      setCollectionData(collectionsResponse.data);
      setStatCollection(statResponse.data);
    })
    .catch((error) => {
      console.error('Error fetching collection data:', error);
    });
  }, [update]);
  
    const fetchData = async (id:string) => {

      try {  
         const response = await axios.get(`${UseApiUrl(api_Config.Collection.getCollectionsById)}?id=${id}`)
        setSeasonCollections(response.data.seasonCollectionsWithProducts);
      } catch (error) {
        console.error('Error fetching season collections:', error);
      }
    };


    return (
    <CollectionContext.Provider value={{ seasonCollections, fetchData, collectionData, statCollection, handleAddCollection, handleUpdateCollection, handleDeleteCollection }}>
      {children}
    </CollectionContext.Provider>
  );
}

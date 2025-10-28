import axios from "axios";
import { createContext,  useEffect,  useState } from "react";
import { api_Config, UseApiUrl } from "../types/api";
import toast from "react-hot-toast";

type CollectionContextType = {
    seasonCollections: any;
    collectionData: any[];
    statCollection?: any;
    handleAddCollection: (newCollection: any) => Promise<void>;
    fetchData: (id: string) => Promise<void>;
};
export const CollectionContext = createContext<CollectionContextType>({
    seasonCollections: [],
    collectionData: [],
    statCollection: undefined,
    handleAddCollection:async ()=> {},
    fetchData: async () => {},
});
export const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [seasonCollections, setSeasonCollections] = useState<any>();
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [statCollection, setStatCollection] = useState<any>();

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
  }, []);
    const fetchData = async (id:string) => {
      try {
        const response = await axios.get(`${UseApiUrl(api_Config.Collection.getCollectionsById)}?id=${id}`)
        setSeasonCollections(response.data.seasonCollectionsWithProducts);
      } catch (error) {
        console.error('Error fetching season collections:', error);
      }
    };
    const handleAddCollection = async(newCollection: any) => {
      try{
        await axios.post(UseApiUrl(api_Config.Collection.AddCollection), newCollection,{headers:{'Content-Type':'application/json'}});
        toast.success('Collection added successfully!');
      }
      catch(error){
        console.error('Error adding new collection:', error);
      }
    };
    return (
    <CollectionContext.Provider value={{ seasonCollections, fetchData, collectionData, statCollection, handleAddCollection }}>
      {children}
    </CollectionContext.Provider>
  );
}

import { useContext, useState } from 'react';
import { Plus, Search,  Edit, Trash2, Eye,  Package, Star, Zap, Shirt,ArrowRight, Filter, Grid, List } from 'lucide-react';
import { CollectionContext } from '../../../contexts/SeasonContext';
import { useNavigate } from 'react-router-dom';
import AddCollectionForm from './CollectionComponent/AddCollectionForm';


export default function Collections() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeAddCollection, setActiveAddCollection] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Add');
  const [dataEdit, setDataEdit] = useState<any>(null);
  const { collectionData, statCollection,handleDeleteCollection } = useContext(CollectionContext);
  const navigate=useNavigate()

  const filteredCollections = collectionData?.filter((collection) => 
    collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleclick=(id:string)=>{
    navigate(`/Collection/${id}`)
  }
  return (
    <div className="max-h-screen  overflow-y-auto bg-black text-white p-8 relative overflow-hidden">
      {activeAddCollection?
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto "> 
        <AddCollectionForm status={status}  season={dataEdit} setState={setActiveAddCollection} />
      </div>

      :''}
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-0 left-0 w-full h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-full h-96 bg-pink-400/15 rounded-full blur-3xl animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
      </div>

      <div className="w-full mx-auto relative z-10">
        <div className="mb-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-white via-pink-200 to-rose-200 bg-clip-text text-transparent">
                  Collections
                </h1>
              </div>
              <p className="text-gray-400 text-lg">Curated. Crafted. Captivating.</p>
            </div>
            <button onClick={()=> setActiveAddCollection(true)} className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl font-bold text-lg overflow-hidden transform hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <Plus className="w-6 h-6" />
                <span>Create New</span>
              </div>
            </button>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Collections', value: statCollection?.totalCollection || 0, icon: Package, color: 'from-pink-500 to-rose-500', change: '+12%' },
              { label: 'Products', value: statCollection?.totalProduct || 0, icon: Shirt, color: 'from-rose-500 to-pink-600', change: '+8%' },
              { label: 'Rating', value: statCollection?.totalRating.toLocaleString() || 0, icon: Star, color: 'from-pink-400 to-rose-400', change: '+5%' },
              { label: 'Views', value: statCollection?.totalViews.toLocaleString() || 0, icon: Eye, color: 'from-fuchsia-500 to-pink-500', change: '+15%' }
            ].map((stat, i) => (
              <div key={i} className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{stat.change}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-white placeholder-gray-500"
              />
            </div>
            <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <Filter className="w-5 h-5" />
            </button>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredCollections?.map((collection, index) => {
            return (
              <div
                key={collection.id}
                className="group relative"
                style={{animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`}}
              >
                <div className="relative h-[500px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02]">
                  {/* Image with overlay */}
                  <div className="absolute inset-0">
                    <img 
                      src={collection.banner} 
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Floating actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 z-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    {[
                      { icon: Edit, color: 'from-purple-500 to-pink-500', handleclick: () => { setStatus('edit'); setDataEdit(collection);setActiveAddCollection(true) } },
                      { icon: Trash2, color: 'from-red-500 to-orange-500', handleclick: () => {
                        if (window.confirm('Are you sure you want to delete this collection?')) {
                          handleDeleteCollection(collection.id);
                        }
                      }},
                    ].map((action, i) => (
                      <button onClick={action.handleclick} key={i} className={`p-3 bg-gradient-to-br ${action.color} rounded-xl backdrop-blur-xl hover:scale-110 transition-transform`}>
                        <action.icon onClick={action.handleclick} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>

          

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-100">
                    <div className="transform transition-all duration-500 group-hover:-translate-y-4">
                      <div className="inline-block mb-3 px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
                        <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {collection.name.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black mb-3 leading-tight">
                        {collection.slogan || collection.name}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                      <button type="button" onClick={() => handleclick(collection.id)} className="w-full group/btn relative px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold overflow-hidden transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center justify-center gap-2">
                          <span>Explore Collection</span>
                          <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Card */}
          <div 
            className="group cursor-pointer"
            style={{animation: `fadeInUp 0.6s ease-out ${(filteredCollections?.length || 0) * 0.1}s both`}}
          >
            <div className="h-[500px] backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/20 rounded-3xl hover:border-purple-500 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div onClick={()=> setActiveAddCollection(true)} className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black mb-2">Create New</h3>
                <p className="text-gray-400">Start a fresh collection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

import Icon from './icon';


const StatsCard = ({ data }: { data: any }) => {
  return (
    <div className="bg-white dark:bg-dark-surface p-6  shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className="p-2 bg-background dark:bg-zinc-800 rounded">
          {data.icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-accent">
          {data.isPositive ? (
            <Icon name="TrendingUp" size={10} className="text-accent" />
          ) : (
            <Icon name="TrendingDown" size={10} className="text-accent" />
          )}
          {data.trend}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-accent uppercase tracking-widest mb-1">{data.title}</p>
        <h3 className="serif text-2xl font-normal ">{data.value}</h3>
        <p className="text-[10px] text-accent italic mt-2">so với tháng trước</p>
      </div>
    </div>
  );
};

export default StatsCard;

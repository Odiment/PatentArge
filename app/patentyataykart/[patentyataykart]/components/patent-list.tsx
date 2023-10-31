import PatentCardYatay from './patent-card-yatay'
import { Database } from '@/app/supabase'


type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentListProps {
    items: PatentlerX[] | null
    bilgiler: PatentlerX[]
    userid: string
    patentResimler:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null;
  };

const PatentList: React.FC<PatentListProps> = ({
  items,
  bilgiler,
  patentResimler,
  userid,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        {items?.map((item, index) => (
          <PatentCardYatay
            key={item.id}
            data={item}
            bilgiler={bilgiler[index]}
            patent_id={item.id}
            patentResimler={patentResimler}
            userid={userid}
          />
        ))}
      </div>
    </div>
  )
}

export default PatentList

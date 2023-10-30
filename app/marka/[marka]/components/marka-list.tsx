/* import { Database } from '@/app/database.types' */
import MarkaCard from './marka-card'
import { Database } from '@/app/supabase'

type MarkalarX = Database['public']['Tables']['markalar']['Row']

interface ProductListProps {
  items: MarkalarX[] | null
  bilgiler: MarkalarX[] | null
  userid: string | undefined
}

const MarkaList: React.FC<ProductListProps> = ({ items, bilgiler, userid }) => {
  return (
    <div key={items.id} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 min-[1350px]:grid-cols-6 min-[1650px]:grid-cols-8 gap-4">
        {items?.map((item, index) => (
          <div key={item.id}>
            <MarkaCard
              key={item.id}
              data={item}
              bilgiler={bilgiler[index]}
              marka_id={item.id}
              userid={userid}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarkaList

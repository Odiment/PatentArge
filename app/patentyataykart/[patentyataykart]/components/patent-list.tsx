import { Database } from '@/app/database.types'
import PatentCardYatay from './patent-card-yatay'

interface ProductListProps {
  items: Database[]
  bilgiler: Database[]
}

const PatentList: React.FC<ProductListProps> = ({
  items,
  bilgiler,
  patentResimler,
  user,
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
            user={user}
          />
        ))}
      </div>
    </div>
  )
}

export default PatentList

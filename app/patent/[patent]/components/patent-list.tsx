import { Database } from '@/app/database.types'
import PatentCard from './patent-card'

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
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items?.map((item, index) => (
          <>
            <PatentCard
              key={item.id}
              data={item}
              bilgiler={bilgiler[index]}
              patent_id={item.id}
              patentResimler={patentResimler}
              user={user}
            />
          </>
        ))}
      </div>
    </div>
  )
}

export default PatentList

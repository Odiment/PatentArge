import { Database } from '@/app/database.types'
import MarkaCard from './marka-card'
import MarkaCardYatay from './marka-card-yatay'

interface ProductListProps {
  items: Database[]
  bilgiler: Database[]
}

const MarkaList: React.FC<ProductListProps> = ({ items, bilgiler, user }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        {items?.map((item, index) => (
          <MarkaCardYatay
            key={item.id}
            data={item}
            bilgiler={bilgiler[index]}
            user={user}
          />
        ))}
      </div>
    </div>
  )
}

export default MarkaList

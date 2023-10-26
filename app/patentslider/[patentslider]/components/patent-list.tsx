import { Database } from '@/app/database.types'
import PatentLongCard from './patent-long-card'

interface ProductListProps {
  items: Database[]
  bilgiler: Database[]
}

const PatentList: React.FC<ProductListProps> = ({
  items,
  bilgiler,
  patentResimler,
  productResimler,
  productRemoteResimler,
  user,
}) => {
  return (
    <div className="space-y-4">
      {items?.map((item, index) => (
        <>
          <PatentLongCard
            key={item.id}
            data={item}
            bilgiler={bilgiler[index]}
            patent_id={item.id}
            patentResimler={patentResimler}
            productResimler={productResimler}
            productRemoteResimler={productRemoteResimler}
            user={user}
          />
        </>
      ))}
    </div>
  )
}

export default PatentList

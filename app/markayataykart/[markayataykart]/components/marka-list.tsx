/* import { Database } from '@/app/database.types' */
/* import MarkaCard from './marka-card' */
import MarkaCardYatay from "./marka-card-yatay";

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaListProps {
  items: MarkalarX[] | null;
  bilgiler: MarkalarX[] | null;
  userid: string;
}

const MarkaList: React.FC<MarkaListProps> = ({ items, bilgiler, userid }) => {
  let itemid: React.Key | null | undefined = items?.map(({ id }) => id) as
    | React.Key
    | null
    | undefined;

  return (
    <div className="space-y-4">
      {bilgiler != null && (
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
          {items?.map((item, index) => (
            <>
              {item.basvuru_no != null && (
                <div key={item.id}>
                  <MarkaCardYatay
                    key={item.id}
                    data={item}
                    bilgiler={bilgiler[index]}
                    userid={userid}
                  />
                </div>
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarkaList;

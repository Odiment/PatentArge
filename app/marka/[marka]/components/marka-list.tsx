import MarkaCard from "./marka-card";
import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaListProps {
  items: MarkalarX[] | null;
  bilgiler: MarkalarX[] | null;
  userid: string;
  yetki: any | null
  tumMarkaSiniflar: any | null
}

const MarkaList: React.FC<MarkaListProps> = ({ items, bilgiler, userid, yetki, tumMarkaSiniflar }) => {
  let keyid: React.Key | null | undefined = items?.map(({ id }) => id) as
    | React.Key
    | null
    | undefined;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 min-[1350px]:grid-cols-6 min-[1650px]:grid-cols-8 gap-4">
        {bilgiler != null && (
          <>
            {items?.map((item, index) => (
              <>
                {item.basvuru_no != null && (
                  <div key={item.basvuru_no}>
                    <MarkaCard
                      data={item}
                      bilgiler={bilgiler[index]}
                      userid={userid}
                      yetki = {yetki}
                      tumMarkaSiniflar={tumMarkaSiniflar}
                    />
                  </div>
                )}
              </>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MarkaList;

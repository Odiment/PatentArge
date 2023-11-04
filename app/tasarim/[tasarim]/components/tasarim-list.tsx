import TasarimCard from "./tasarim-card";
import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface TasarimListProps {
  items: TasarimlarX[] | null;
  bilgiler: TasarimlarX[] | null;
  userid: string;
  tasarimResimler:
    | {
        tasarim_resim_url: string | null;
        tasarim_id: string;
      }[]
    | null;
}

const TasarimList: React.FC<TasarimListProps> = ({
  items,
  bilgiler,
  tasarimResimler,
  userid,
}) => {
  return (
    <div className="space-y-4">
      {bilgiler != null && (
        <div
          key={2}
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items?.map((item, index) => (
            <>
              {item.basvuru_no != null && (
                <div key={item.id}>
                  <TasarimCard
                    key={index}
                    data={item}
                    bilgiler={bilgiler[index]}
                    tasarim_id={item.id}
                    tasarimResimler={tasarimResimler}
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

export default TasarimList;

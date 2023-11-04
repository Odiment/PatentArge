import TasarimCardYatay from "./tasarim-card-yatay";
import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface TasarimListProps {
  items: TasarimlarX[] | null;
  bilgiler: TasarimlarX[];
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
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        {items?.map((item, index) => (
          <>
            {item.basvuru_no != null && (
              <div key={item.id}>
                <TasarimCardYatay
                  key={item.id}
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
    </div>
  );
};

export default TasarimList;

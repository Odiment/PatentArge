import PatentCard from "./patent-card";
import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentListProps {
  /* items: PatentlerX[] | null; */
  bilgiler: PatentlerX[] | null;
  /* userid: string; */
  yetki: any | null
  patentResimler:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null;
}

const PatentList: React.FC<PatentListProps> = ({
  /* items, */
  bilgiler,
  patentResimler,
  /* userid, */
  yetki,
}) => {
  let keyid: React.Key | null | undefined = bilgiler?.map(({ id }) => id) as
    | React.Key
    | null
    | undefined;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bilgiler != null && (
          <>
            {bilgiler?.map((item, index) => (
              <div key={item.referans_no}>
                {item.basvuru_no != null && (
                  <div key={item.basvuru_no}>
                    <PatentCard
                      /* data={item} */
                      bilgiler={bilgiler[index]}
                      /*  patent_id={bilgiler[index].id} */
                      patentResimler={patentResimler}
                      /* userid={userid} */
                      yetki = {yetki}
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PatentList;

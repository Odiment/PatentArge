import PatentCard from "./patent-card";
import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentListProps {
  items: PatentlerX[] | null;
  bilgiler: PatentlerX[] | null;
  userid: string;
  patentResimler:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null;
}

const PatentList: React.FC<PatentListProps> = ({
  items,
  bilgiler,
  patentResimler,
  userid,
}) => {

    let keyid: React.Key | null | undefined = items?.map(({ id }) => id) as
    | React.Key
    | null
    | undefined;
      

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bilgiler != null && (
          <>
            {items?.map((item, index) => (
              <div key={keyid}>
                {item.basvuru_no != null && (
                  <div key={item.basvuru_no}>
                    <PatentCard
                      data={item}
                      bilgiler={bilgiler[index]}
                      patent_id={item.id}
                      patentResimler={patentResimler}
                      userid={userid}
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

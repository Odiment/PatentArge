import PatentLongCard from "./patent-long-card";
import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentListProps {
  items: PatentlerX[] | null;
  bilgiler: PatentlerX[];
  patentResimler:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null;
  productResimler:
    | {
        product_resim_url: string | null;
        patent_id: string;
      }[]
    | null;
  productRemoteResimler:
    | {
        product_remote_url: string | null;
        patent_id: string;
      }[]
    | null;
  userid: string | null;
}

const PatentList: React.FC<PatentListProps> = ({
  items,
  bilgiler,
  patentResimler,
  productResimler,
  productRemoteResimler,
  userid,
}) => {
  return (
    <div className="space-y-4">
      {items?.map((item, index) => (
          <PatentLongCard
            key={index}
            data={item}
            bilgiler={bilgiler[index]}
            patent_id={item.id}
            patentResimler={patentResimler}
            productResimler={productResimler}
            productRemoteResimler={productRemoteResimler}
            userid={userid!}
          />
      ))}
    </div>
  );
};

export default PatentList;

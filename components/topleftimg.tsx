import Image from "next/image";
import TopLeft from "@/public/top-left-img.png"


const TopLeftImg = () => {
  return (
    <div className="absolutemix-blend-color-dodge z-10 w-[200px] xl-w-[400px] opacity-50">
      <Image src={TopLeft} width={400} height={400} alt="" />
    </div>
  );
};

export default TopLeftImg;

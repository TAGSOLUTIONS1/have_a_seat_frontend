import { ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./scroll.css"

type CardProps = React.ComponentProps<typeof Card>;

export function Card1({ className, ...props }: CardProps) {
  return (
    <Card className={cn("w-[300px] h-8/9 p-2", className)} {...props}>
      <CardHeader>
        <CardTitle className='text-center'>Offers & Discounts</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
      <div className="flex items-center">
          <div className="w-full space-y-1 relative">
            <button className="w-full flex items-center justify-between bg-purple-600 rounded-md shadow-md border border-gray-300 p-2 text-white hover:bg-gray-200 hover:text-purple-600 focus:outline-none">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Hot Offers</p>
              </div>
              <div className="p-2 rounded-full bg-gray-200">
                <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </div>
        <div className="justify-center text-center flex flex-col max-h-40 overflow-hidden ">
  <div className="overflow-y-scroll hide-scrollbar">
    <button className="m-4 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none block text-center">
      Japanese
    </button>
    <hr className="my-1" />
    <button className="m-4 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none block text-center">
      Thai
    </button>
    <hr className="my-1" />
    <button className="m-4 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none block text-center">
      Indian
    </button>
    <hr className="my-1" />
    <button className="m-4 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none block text-center">
      Chinese
    </button>
    <hr className="my-1" />
    <button className="m-4 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none block text-center">
      American
    </button>
  </div>
</div>

      </CardContent>
    </Card>
  );
}

export default Card1;

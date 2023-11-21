import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

export function SearchBar() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <div>
      <div
        className="flex items-center justify-center rounded-lg bg-white text-gray-500 cursor-pointer p-4"
        style={{ width: '200px', height: '70px' }}
      >
        <Search className="w-6 h-6 mx-2" />
        <span className="text-lg font-semibold mx-2">Search</span>
      </div>
    </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Here</DialogTitle>
          <DialogDescription>
            search what you are looking for:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Search" className="text-right">
              Search
            </Label>
            <Input
              id="Search"
              defaultValue="search"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Search</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
 export default SearchBar
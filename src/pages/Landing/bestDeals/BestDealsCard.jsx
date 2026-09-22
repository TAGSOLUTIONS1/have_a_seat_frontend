export default function BestDealsCard({ img, text }) {
  return (
    <div
      className="relative w-full h-[375px] bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
      style={{ backgroundImage: `url('${img}')` }}
    >
      {/* Overlay for better text contrast */}
      <div className="absolute p-14">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold">Special offer</h1>
          </div>
          <div>
            <p className="text-[21px]">{text}</p>
          </div>
          <div>
            <button className="bg-plum px-6 py-2 rounded-lg text-white">
              Get Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

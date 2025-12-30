export default function ProductReviews() {
  return (
    <div className="p-4 rounded-box shadow fade  ring">
      <h2 className="text-2xl font-semibold mb-8">Rating & Reviews</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-8">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-7xl font-bold">4,5</span>
          <span className="text-base-content text-opacity-60 text-sm">
            (50 New Reviews)
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-64">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-warning">★</span>
              <span className="text-sm w-4">{star}</span>
              <div className="grow bg-base-300 h-2 rounded-full">
                <div
                  className={`bg-primary h-2 rounded-full ${
                    star === 5 ? "w-[90%]" : star === 4 ? "w-[30%]" : "w-[5%]"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

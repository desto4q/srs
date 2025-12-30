import { MapPin } from "lucide-react";

export function DeliveryInfo() {
  return (
    <div className="card bg-base-100 shadow  ring fade space-y-2 rounded-box">
      <div className="flex items-center justify-between  border-b fade p-3">
        <h2 className="card-title  font-bold">Delivery Information</h2>
      </div>

      <div className="flex  gap-2 p-4">
        <MapPin className="size-6 stroke-primary" />
        {/*<div className="bg-red-200 p-0">
          ss
          <p>ss</p>
        </div>*/}
        <p className="text-base leading-tight">
          Delivering to:{" "}
          <span className="font-semibold text-base-content">
            123 Main St, Anytown, USA 12345
          </span>
          <br />
          <span className="text-sm text-gray-500">
            Estimated delivery: 30-45 minutes
          </span>
        </p>
      </div>
      {/*<div className="card-actions justify-end">
        <button className="btn btn-primary btn-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pencil"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          Change Location
        </button>
      </div>*/}
    </div>
  );
}

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";

const Model = () => {
  let [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="relative max-w-2xl space-y-4 border rounded-2xl bg-[#D2EF9A] p-12">
            {/* Close Icon */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Special Offer Text */}
            <p className="text-sm font-light instrument-sans text-gray-600 text-center">
              SPECIAL OFFER
            </p>

            {/* Black Fridays Title */}
            <DialogTitle className="instrument-sans text-4xl text-center">
              BLACK FRIDAYS
            </DialogTitle>

            {/* Description */}
            <Description className="text-center instrument-sans">
              NEW CUSTOMERS SAVE <span className="text-red-500">30%</span> WITH
              THE CODE
            </Description>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="bg-white instrument-sans text-black rounded-lg px-6 py-2">
                GET20OFF
              </button>
              <button className="bg-[#1F1F1F] instrument-sans text-white rounded-lg px-6 py-2">
                COPY COUPON CODE
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Model;

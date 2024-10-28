import React from "react";
import Layout from "../components/Layout/Layout";
import {
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const Contact = () => {
  return (
    <Layout>
      <h2 className="text-4xl instrument-sans text-[#1f1f1f] text-center mt-10">
        Contact Us
      </h2>
      <div className=" rounded-lg p-8 w-full gap-8 grid lg:grid-cols-2 lg:px-20">
        <div className="">
          <img
            src="../images/contact1.svg"
            alt="Contact us"
            className="w-full"
          />
        </div>
        <div className=" grid lg:grid-cols-3 gap-8 ">
          <div className="space-y-4 col-span-1">
            <div className="flex items-center space-x-3">
              <span className="bg-blue-50 p-3 rounded-full">
                <MapPinIcon class="h-6 w-6 text-[#1F1F1F]" />
              </span>
              <div>
                <p className="instrument-sans text-lg">Address</p>
                <span>St. George’s Suits</span>
                <br />
                <span>
                  8815 Alondra Blvd <br />
                  Paramount, CA 90723
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-blue-50 p-3 rounded-full">
                <PhoneIcon class="h-6 w-6 text-[#1F1F1F]" />
              </span>
              <div>
                <p className="instrument-sans text-lg">Number</p>
                <p>(562) 350-6785</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-blue-50 p-3 rounded-full">
                <EnvelopeIcon class="h-6 w-6 text-[#1F1F1F]" />
              </span>
              <div>
                <p className="instrument-sans text-lg">E-mail</p>
                <p>stgtailor@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 col-span-2">
            <div className="flex  items-center space-x-3">
              <span className="bg-blue-50 p-3 rounded-full">
                <ClockIcon class="h-6 w-6 text-[#1F1F1F]" />
              </span>
              <div className="space-y-1">
                <h3 className="instrument-sans text-lg">Business Hours</h3>
                <span className="flex justify-between">
                  <span>Monday</span>
                  <span>10:00 AM - 09:00 PM</span>
                </span>
                <span className="flex justify-between">
                  <span>Tuesday</span>
                  <span>10:00 AM - 09:00 PM</span>
                </span>
                <span className="flex justify-between">
                  <span>Wednesday</span>
                  <span>10:00 AM - 09:00 PM</span>
                </span>
                <span className="flex justify-between">
                  <span>Thursday</span>
                  <span>10:00 AM - 09:00 PM</span>
                </span>
                <span className="flex justify-between">
                  <span>Friday</span>
                  <span>10:00 AM - 09:00 PM</span>
                </span>
                <span className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 09:00 PM</span>
                </span>
                <span className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 08:00 PM</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-64 mb-4 px-4 pt-10">
        <iframe
          title="Shop Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2999.7576230223035!2d-118.31086752483344!3d33.816439830145555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2cdfebf9effb9%3A0x8a9dd42c7caa2bf1!2sSt.%20George%20Suits!5e1!3m2!1sen!2sin!4v1729780414376!5m2!1sen!2sin"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </div>
    </Layout>
  );
};

export default Contact;

import React from "react";
import Layout from "../components/Layout/Layout";
import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Layout>
      <main class="grid min-h-full place-items-center bg-white px-6 mt-20 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
          <p class="font-semibold text-blue-600 text-2xl">404</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p class="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div class="mt-10 flex items-center justify-center space-x-5">
            <NavLink
              to="/"
              class="rounded-lg bg-blue-500 hover:bg-blue-600 duration-300 transition-all px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              Go back home
            </NavLink>
            <NavLink to="/contact" class="text-sm font-semibold bg-blue-500 hover:bg-blue-600 duration-300 transition-all px-3.5 py-2.5 rounded-lg text-white ">
              Contact support <span aria-hidden="true">&rarr;</span>
            </NavLink>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PageNotFound;

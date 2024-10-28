import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const { auth, setAuth } = useAuth();
  return (
    <div className="flex">
      <div className="stick h-screen top-0">
        <UserMenu />
      </div>

      <div className="p-4 w-3/4 overflow-auto">
        <div class="p-4 border-2 rounded-lg">
          <h4 className=" text-2xl">Name : {auth?.user?.username}</h4>
          <p class="mb-2 text-2xl  text-gray-900 ">
            {" "}
            Email : {auth?.user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

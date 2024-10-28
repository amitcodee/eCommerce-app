import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Profile = () => {
  const [auth, setAuth] = useAuth()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");


 //get user data
 useEffect(() => {
  const { email, name, phone, address } = auth?.user;
  setName(name);
  setPhone(phone);
  setEmail(email);
  setAddress(address);
}, [auth?.user]);

// form function
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.put("/api/v1/auth/profile", {
      name,
      email,
      password,
      phone,
      address,
    });
    if (data?.errro) {
      toast.error(data?.error);
    } else {
      setAuth({ ...auth, user: data?.updatedUser });
      let ls = localStorage.getItem("auth");
      ls = JSON.parse(ls);
      ls.user = data.updatedUser;
      localStorage.setItem("auth", JSON.stringify(ls));
      toast.success("Profile Updated Successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
  return (
    
      <div className="grid lg:grid-cols-4">
        <div className="col-span-1 lg:px-12 sm:px-3 mt-5">
          <UserMenu />
        </div>

        <div className="p-4 col-span-3">
          <div class="p-4 border-2 border-gray-400 rounded-lg">
            <div class="block max-w-auto p-6 ">
              <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-1 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                
                  <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Update your account
                  </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="name"
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          autoComplete="name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Password
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          autoComplete="current-password"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone
                      </label>
                      <div className="mt-2">
                        <input
                          id="phone"
                          name="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          type="text"
                          autoComplete="phone"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="Address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Address
                      </label>
                      <div className="mt-2">
                        <input
                          id="Address"
                          name="Address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          type="text"
                          autoComplete="Address"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Update 
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default Profile;

import { Fragment, useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Menu,
  Transition,
} from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  Bars3CenterLeftIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth"; // Import AuthContext
import { useCart } from "../../context/cart";
import { Switch } from "antd";
import axios from "axios"; // Import axios to make API requests

const Navbar = ({ toggleTheme, currentTheme }) => {
  const [open, setOpen] = useState(false);
  const [searchSidebarOpen, setSearchSidebarOpen] = useState(false); // State to manage search sidebar
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [searchResults, setSearchResults] = useState([]); // State to store the search results

  // const [navigation, setNavigation] = useState(null); // State for navigation data
  const { auth, setAuth } = useContext(AuthContext); // Access auth state
  const navigate = useNavigate(); // To navigate after logout
  const { cart } = useCart();

  // Fetch navigation data from the server
  const [navigation, setNavigation] = useState({
    categories: [],
    pages: [
      { name: "Products", href: "/all-products" },
      { name: "Contact Us", href: "/contact-us" },
      { name: "Blogs", href: "/blogs" },
    ],
  });

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category");
      if (data.success) {
        const categories = data.categories;

        // Populate navigation with categories dynamically
        const updatedNavigation = {
          ...navigation,
          categories: [
            {
              id: "shop",
              name: "Shop",
              featured: [
                {
                  name: "New Arrivals",
                  href: "/category/new-arrivals",
                  imageSrc:
                    "https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fslider%2Fbg1-2.png&w=750&q=75",
                  imageAlt:
                    "Models sitting back to back, wearing Basic Tee in black and bone.",
                },
                {
                  name: "Basic Tees",
                  href: "/women/basic-tees",
                  imageSrc:
                    "http://localhost:3000/uploads/products/1727880804908-179393929.webp",
                  imageAlt:
                    "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
                },
              ],
              sections: [
                {
                  id: "clothing",
                  name: "Clothing",
                  items: categories.map((category) => ({
                    name: category.name,
                    href: `/category/${category.slug}`,
                  })),
                },
              ],
            },
            // {
            //   id: "men",
            //   name: "Men",
            //   featured: [
            //     {
            //       name: "New Arrivals",
            //       href: "/category/new-arrivals",
            //       imageSrc:
            //         "https://minion-vinovatheme.myshopify.com/cdn/shop/files/bn_4_720x.jpg?v=1617444740",
            //       imageAlt:
            //         "Drawstring top with elastic loop closure and textured interior padding.",
            //     },
            //     {
            //       name: "Artwork Tees",
            //       href: "/men/artwork-tees",
            //       imageSrc:
            //         "https://minion-vinovatheme.myshopify.com/cdn/shop/files/bn_4_720x.jpg?v=1617444740",
            //       imageAlt:
            //         "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
            //     },
            //   ],
            //   sections: [
            //     {
            //       id: "clothing",
            //       name: "Clothing",
            //       items: categories.map((category) => ({
            //         name: category.name,
            //         href: `/category/${category.slug}`,
            //       })),
            //     },
            //   ],
            // },
          ],
        };

        setNavigation(updatedNavigation); // Update the state with the new navigation
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, []);

  // setNavigation(data);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setAuth({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    navigate("/login");
  };

  // Show a loading state if the navigation data has not been loaded yet
  if (!navigation) {
    return (
      <div className="bg-white">
        <p>Loading navigation...</p>
      </div>
    );
  }

  // Function to handle search input change
  const handleSearchInputChange = async (e) => {
    const keyword = e.target.value;
    setSearchQuery(keyword);

    if (keyword.length > 2) {
      try {
        const response = await axios.get(`/api/products/search/${keyword}`, {
          params: { name: keyword }, // Use 'name' query parameter for searching by name
        });
        if (response.data) {
          setSearchResults(response.data); // Set search results
        } else {
          console.error("No products found");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]); // Clear results if query is too short
    }
  };

  return (
    <div className=" ">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Dynamic Links */}
            <TabGroup className="">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pb-8 pt-10"
                  >
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                            <img
                              src={item.imageSrc}
                              alt={item.imageAlt}
                              className="object-cover object-center"
                            />
                          </div>
                          <NavLink
                            to={item.href}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            {item.name}
                          </NavLink>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p className="font-medium text-gray-900">
                          {section.name}
                        </p>
                        <ul className="mt-6 flex flex-col space-y-6">
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <NavLink
                                to={item.href}
                                className="-m-2 block p-2 text-gray-500"
                              >
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <NavLink
                    to={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </NavLink>
                </div>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Right Sidebar for Search */}
      <Transition.Root show={searchSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={setSearchSidebarOpen}
        >
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl rounded-l-3xl">
                      <div className="px-4 py-6 sm:px-6 flex justify-between items-center border-b border-gray-200">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Search Products
                        </Dialog.Title>
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500"
                          onClick={() => setSearchSidebarOpen(false)}
                        >
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Search Input */}
                        <div className="mb-4">
                          <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <h1 className="">PRODUCTS</h1>
                        <hr className="mb-4" />
                        {/* Search Results */}
                        <div>
                          {searchResults.length > 0 ? (
                            <ul>
                              {searchResults.map((product) => (
                                <li key={product._id} className="">
                                  <NavLink
                                    to={`/product/${product._id}`}
                                    onClick={() => setSearchSidebarOpen(false)} // Close sidebar on navigation
                                  >
                                    <div className="flex items-center hover:bg-gray-100 rounded-md py-2">
                                      <img
                                        src={
                                          product.images[0]?.url ||
                                          "https://via.placeholder.com/150"
                                        }
                                        alt={product.name}
                                        className="h-16 w-16 object-cover mr-4"
                                      />
                                      <div>
                                        <p className="text-lg font-medium">
                                          {product.name}
                                        </p>
                                        <p className="text-sm text-gray-800">
                                          ₹{product.variants?.[0].price}
                                        </p>
                                      </div>
                                    </div>
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            searchQuery.length > 2 && <p>No products found</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-[#F9F6F0] dark:bg-gray-900 dark:text-white">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-md p-2 text-gray-600 lg:hidden"
              >
                <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className=" flex lg:ml-0">
                <NavLink to={"/"}>
                  <span className="font-bold text-[#1F1F1F] instrument-sans dark:text-white lg:text-xl">
                    ST. GEORGE SUITS
                  </span>
                </NavLink>
              </div>

              <PopoverGroup className="hidden lg:ml-12 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <PopoverButton className="flex items-center text-md font-medium text-gray-700 dark:text-white ">
                        {category.name}
                      </PopoverButton>
                      <PopoverPanel className="absolute z-40 inset-x-0 top-full text-sm text-gray-500 dark:text-white">
                        <div
                          className="absolute inset-0 top-1/2 bg-white shadow"
                          aria-hidden="true"
                        />
                        <div className="relative bg-white dark:bg-gray-900">
                          <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div
                                    key={item.name}
                                    className="group relative text-base sm:text-sm"
                                  >
                                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                      <img
                                        src={item.imageSrc}
                                        alt={item.imageAlt}
                                        className="object-cover object-center"
                                      />
                                    </div>
                                    <NavLink
                                      to={item.href}
                                      className="mt-6 block font-medium text-gray-900 dark:text-white"
                                    >
                                      {item.name}
                                    </NavLink>
                                    <p aria-hidden="true" className="mt-1">
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {section.name}
                                    </p>
                                    <ul className="mt-5 space-y-6">
                                      {section.items.map((item) => (
                                        <li key={item.name}>
                                          <NavLink
                                            to={item.href}
                                            className=" dark:text-white"
                                          >
                                            {item.name}
                                          </NavLink>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <NavLink
                      key={page.name}
                      to={page.href}
                      className="flex items-center text-md font-medium text-gray-700  dark:text-white"
                    >
                      {page.name}
                    </NavLink>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                {/* theme Toggle */}
                {/* <div className="flex lg:mr-3 items-center space-x-3">
                  <Switch
                    checked={currentTheme === "dark"}
                    onChange={toggleTheme}
                    checkedChildren="Dark"
                    unCheckedChildren="Light"
                  />
                </div> */}

                {/* Search */}
                <div className="flex lg:mr-3">
                  <button
                    onClick={() => setSearchSidebarOpen(true)} // Open search sidebar
                    className="p-2 text-[#1F1F1F] hover:text-gray-500 dark:text-white"
                  >
                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* User Account */}
                <div className="flex lg:ml-1">
                  {auth?.isAuthenticated && auth?.user ? (
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center text-sm font-medium text-[#1F1F1F] hover:text-gray-500 dark:text-white">
                        <span>{auth?.user?.username}</span>
                      </Menu.Button>
                      <Transition as={Fragment}>
                        <Menu.Items className="absolute z-40 right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-900 border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg dark:text-white">
                          <div className="py-1">
                            <Menu.Item>
                              <NavLink
                                to={`/dashboard/${
                                  auth?.user?.role === "admin"
                                    ? "admin"
                                    : "user"
                                }`}
                                className="block px-4 py-2 text-sm dark:text-white"
                              >
                                Dashboard
                              </NavLink>
                            </Menu.Item>
                            <Menu.Item>
                              <button
                                onClick={handleLogout}
                                className="block px-4 py-2 text-sm dark:text-white"
                              >
                                Logout
                              </button>
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <NavLink
                      to={"/login"}
                      className="text-sm font-medium text-[#1F1F1F] hover:text-gray-500 dark:text-white"
                    >
                      <UserIcon className="h-6 w-6" />
                    </NavLink>
                  )}
                </div>

                {/* Cart */}
                <div className="flow-root lg:ml-3">
                  <Badge
                    color="#1F1F1F"
                    count={cart.length}
                    offset={[-1, 1]}
                    showZero
                  >
                    <NavLink
                      to={"/cart"}
                      className="group -m-2 flex items-center p-2"
                    >
                      <ShoppingBagIcon className="h-6 w-6 flex-shrink-0 text-[#1F1F1F] group-hover:text-gray-500 dark:text-white" />
                    </NavLink>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;

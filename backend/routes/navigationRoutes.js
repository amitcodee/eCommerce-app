// routes/navigation.js
const express = require('express');
const router = express.Router();

// Example navigation data (this would typically come from your database)
const navigationData = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Arrivals",
          href: "/women/new-arrivals",
          imageSrc: "https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt: "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          href: "/women/basic-tees",
          imageSrc: "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt: "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "/women/tops" },
            { name: "Dresses", href: "/women/dresses" },
            { name: "Pants", href: "/women/pants" },
            { name: "Denim", href: "/women/denim" },
            { name: "Sweaters", href: "/women/sweaters" },
            { name: "T-Shirts", href: "/women/t-shirts" },
            { name: "Jackets", href: "/women/jackets" },
            { name: "Activewear", href: "/women/activewear" },
            { name: "Browse All", href: "/women" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "/women/watches" },
            { name: "Wallets", href: "/women/wallets" },
            { name: "Bags", href: "/women/bags" },
            { name: "Sunglasses", href: "/women/sunglasses" },
            { name: "Hats", href: "/women/hats" },
            { name: "Belts", href: "/women/belts" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", href: "/brands/full-nelson" },
            { name: "My Way", href: "/brands/my-way" },
            { name: "Re-Arranged", href: "/brands/re-arranged" },
            { name: "Counterfeit", href: "/brands/counterfeit" },
            { name: "Significant Other", href: "/brands/significant-other" },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        {
          name: "New Arrivals",
          href: "/men/new-arrivals",
          imageSrc: "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
          imageAlt: "Drawstring top with elastic loop closure and textured interior padding.",
        },
        {
          name: "Artwork Tees",
          href: "/men/artwork-tees",
          imageSrc: "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt: "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "/men/tops" },
            { name: "Pants", href: "/men/pants" },
            { name: "Sweaters", href: "/men/sweaters" },
            { name: "T-Shirts", href: "/men/t-shirts" },
            { name: "Jackets", href: "/men/jackets" },
            { name: "Activewear", href: "/men/activewear" },
            { name: "Browse All", href: "/men" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "/men/watches" },
            { name: "Wallets", href: "/men/wallets" },
            { name: "Bags", href: "/men/bags" },
            { name: "Sunglasses", href: "/men/sunglasses" },
            { name: "Hats", href: "/men/hats" },
            { name: "Belts", href: "/men/belts" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Re-Arranged", href: "/brands/re-arranged" },
            { name: "Counterfeit", href: "/brands/counterfeit" },
            { name: "Full Nelson", href: "/brands/full-nelson" },
            { name: "My Way", href: "/brands/my-way" },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "Products", href: "/products" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Blogs", href: "/blogs" },
  ],
};

// Endpoint to fetch navigation data
router.get('/navigation', (req, res) => {
  console.log(req)
  res.json(navigationData);
  console.log(res)
});

module.exports = router;

// controllers/addressController.js

const Address = require('../models/addressModel');

// Create a new address
// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const {
      addressType,
      recipientName,
      company,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = req.body;

    const userId = req.user._id; // Using the user object attached by the middleware

    // If the new address is set as default, unset previous default addresses
    if (isDefault) {
      await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
    }

    const address = new Address({
      user: userId,
      addressType,
      recipientName,
      company,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault: !!isDefault,
    });

    await address.save();

    res.status(201).json({
      message: 'Address created successfully',
      address,
    });
  } catch (error) {
    console.error('Create Address Error:', error);
    res.status(500).json({ message: 'Server error during address creation' });
  }
};

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user: userId });

    res.status(200).json({
      addresses,
    });
  } catch (error) {
    console.error('Get Addresses Error:', error);
    res.status(500).json({ message: 'Server error while retrieving addresses' });
  }
};

// Get a specific address
exports.getAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({
      address,
    });
  } catch (error) {
    console.error('Get Address Error:', error);
    res.status(500).json({ message: 'Server error while retrieving the address' });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const {
      addressType,
      recipientName,
      company,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = req.body;

    // Find the address to update
    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If isDefault is true, unset previous default addresses
    if (isDefault) {
      await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
    }

    // Update fields if they are provided in the request
    address.addressType = addressType || address.addressType;
    address.recipientName = recipientName || address.recipientName;
    address.company = company || address.company;
    address.line1 = line1 || address.line1;
    address.line2 = line2 || address.line2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;
    address.phone = phone || address.phone;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await address.save();

    res.status(200).json({
      message: 'Address updated successfully',
      address,
    });
  } catch (error) {
    console.error('Update Address Error:', error);
    res.status(500).json({ message: 'Server error during address update' });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOneAndDelete({ _id: addressId, user: userId });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Delete Address Error:', error);
    res.status(500).json({ message: 'Server error during address deletion' });
  }
};

// Set an address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Unset previous default addresses
    await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });

    // Set the selected address as default
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({
      message: 'Default address set successfully',
      address,
    });
  } catch (error) {
    console.error('Set Default Address Error:', error);
    res.status(500).json({ message: 'Server error while setting default address' });
  }
};

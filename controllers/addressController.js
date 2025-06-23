import Address from '../models/Address.js'

export const saveAddress = async (req, res) => {
  const { addressLine, city, pincode, phone, landmark } = req.body
  const userId = req.user

  const address = new Address({
    userId,
    addressLine,
    city,
    pincode,
    phone,
    landmark
  })

  await address.save()
  res.json({ msg: 'Address saved successfully', address })
}

export const getUserAddresses = async (req, res) => {
  const addresses = await Address.find({ userId: req.user })
  res.json(addresses)
}

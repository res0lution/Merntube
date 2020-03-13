import _ from "lodash"

import User from "../models/user.model"
import errorHandler from "../helpers/dbErrorHandler"

const create = async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

}
  
const list = (req, res) => {
  User.find((err, users) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }

    res.json(users)
  }).select("name email updated created")
}

const userByID = async (req, res, next, id) => {

  try {
    let user = await User.findById(id)

    if (!user) {
      return res.status("400").json({
        error: "User not found"
      })
    }

    req.profile = user
    next()
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user"
    })
  }
}
  
const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}
  
const update = async (req, res) => {
  
  try {
    let user = req.profile
    user = _.extend(user, req.body)
    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

}

const remove = async (req, res) => {

  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
  
}
  

export default {
  create, 
  userByID, 
  read, 
  list, 
  remove, 
  update 
}
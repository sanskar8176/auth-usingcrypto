import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { encryptData, decryptData } from '../encrypt/crypto.js'

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (name && email && phone && password ) {

    const ename = encryptData(name);  
    const ephone = encryptData(phone);  
    const eemail = encryptData(email);  


    const user = await UserModel.findOne({ email: eemail })
    if (user) {
      res.send({ "status": "failed", "message": "Email already exists" })
    } else {
        
          try {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const doc = new UserModel({
              name: ename,
              email: eemail,
              phone: ephone,
              password: hashPassword
            })
            await doc.save()
            const saved_user = await UserModel.findOne({ email: eemail })
            // Generate JWT Token
            const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
            // send token with response 
            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
          } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Unable to Register" })
          }
      
        }
      } 
      else {
        res.send({ "status": "failed", "message": "All fields are required" })
      }
  }

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body
      if (email && password) {

        const eemail = encryptData(email);  

        const user = await UserModel.findOne({ email: eemail })
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if ((user.email === eemail) && isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

            const dname = decryptData(user.name);
            const dphone = decryptData(user.phone);


            res.send({ "status": "success", "message": "Login Success", "name": dname, "phone": dphone, "email": email, "token": token })
          } else {
            res.send({ "status": "failed", "message": "Email or Password is not Valid" })
          }
        } else {
          res.send({ "status": "failed", "message": "You are not a Registered User" })
        }
      } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      res.send({ "status": "failed", "message": "Unable to Login" })
    }
  }

  // yha se wok krna hai 

  static resetPassword = async (req, res) => {
    const {email, oldpassword, newpassword} = req.body
    if (email && oldpassword && newpassword) {
      
      const eemail = encryptData(email);  


      const user= await UserModel.findOne({email:eemail});
      
      if (user != null) {
        // check the old details 
        const isMatch = await bcrypt.compare(oldpassword, user.password)
        if ((user.email === eemail) && isMatch) {
          // change password 
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(newpassword, salt)
          await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
          res.send({ "status": "success", "message": "Password changed succesfully" })
        } 
        else {
          res.send({ "status": "failed", "message": "Email or Password is not Valid" })
        }
      } else {
        res.send({ "status": "failed", "message": "You are not a Registered User" })
      }
   }
    else {
      res.send({ "status": "failed", "message": "All Fields are Required" })
    }
  }


  static updateUserDetails = async (req, res) => {
    const { name, email, phone, password } = req.body
    if (name && email && phone && password ) {

      const eemail = encryptData(email);  
      const ename = encryptData(name);  
      const ephone = encryptData(phone);  

    const user = await UserModel.findOne({ email: eemail })
    if (!user) {
      res.send({ "status": "failed", "message": "You are not a Registered User" })
    }
     else {
        // verify user 
        const isMatch = await bcrypt.compare(password, user.password)
        if ((user.email === eemail) && isMatch) {

          try {
            
           await UserModel.findByIdAndUpdate(user._id,{$set:{name: ename, phone: ephone}} );
           res.send({ "status": "success", "message": "User updated succesfully" });

          }
           catch (error) {
            console.log(error);
            res.send({ "status": "failed", "message": "Unable to Update User" })
          }
        }
        else{
          res.send({ "status": "failed", "message": "Email or Password is not Valid" })

        }
      }
    }
    else {
     res.send({ "status": "failed", "message": "All fields are required" })
   }
  }


}

export default UserController;

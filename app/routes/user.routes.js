const Auth = require("../models/user.model.js"); // create & login method calling in this file
const { fetchUser } = require("../middleware/fetchuser.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  const { body, validationResult } = require("express-validator"); // API validation
  const router = require("express").Router();

  /*=========== Fetch All User's Records ============*/
  router.get("/", async (req,res) => {
    try {    
        const userRecord = await Auth.fetchAllUsers();
        res.status(200).json({success : true , data : userRecord})
    } catch (error) {
        return res.status(500).json({success : false , errors : error});
    }
  });

  /*=========== Create New User ===========*/
  router.post(
    "/signup",
    [
      body("firstname", "Please enter firstname").isLength({ min: 2 }),
      body("lastname", "Please enter lastname").isLength({ min: 2 }),
      body("email", "Please enter email").isEmail(),
      body("password", "Please enter password").isLength({ min: 6 }),
    ],
    async (req, res) => {
      try {
        const { firstname, lastname, email, password } = req.body;
   
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(password, salt);

        const newUser = await Auth.createUser(
          firstname,
          lastname,
          email,
          password,
          secPass
        );
        console.log(`newUSer =======> ${JSON.stringify(newUser)}`);

        if (newUser) {
          const data = {
            id: newUser.user_id,
          };
          console.log(`data =====> ${data.id}`);

          const authToken = jwt.sign(data, process.env.JWT_SECRET_KEY); // sign() method is create user auth Token
          return res.status(201).json({ success : true, authToken }); // created 201
        } else return res.status(400).json({ errors: "Bad request" });
      } catch (error) {
        console.log(`Error user not created --> ${error}`);
        res.status(500).json({ err: error });
      }
    }
  );

  /*============ Login Existing User ===========*/
  router.post(
    "/login",
    [
      body("email", "Please Enter email").isEmail(),
      body(
        "password",
        "Please Enter Password & password length must be greater then 3 charcter..!!!"
      ).isLength({ min: 3 }),
    ],
    async (req, res) => {
      console.log('req.body == ',req.body)
      let success = false;
      try {

        const userRec = await Auth.findUserByEmail(req.body.email); // search User By Email.
        console.log("userRec : ", userRec);

        if (!userRec) {
          return res.status(404).json({
            success: false,
            // errors: "Try to login with correct credentials",
            errors: "User Not exist with this email-Id !",
          });
        }

        console.log("passwprd: ", userRec.user_password, req.body.password);
        const passwordCompare = await bcrypt.compare(req.body.password, userRec.user_password);

        console.log("password:compare", passwordCompare);
        if(!passwordCompare) {
          return res.status(400).json({ success, errors: "Try to login with correct credentials" });
        }

        delete userRec.user_password;
        const authToken = jwt.sign(userRec, process.env.JWT_SECRET_KEY, {expiresIn: "5h"});
        success = true;
        console.log("authToken", authToken);
        return res.status(201).json({ success, authToken });

      } catch (error) {
        res.status(400).json({ success: success, errors: "error" });
      }
    }
  );

  app.use("/api/auth", router); // --> comman routes for all endpoints.
};

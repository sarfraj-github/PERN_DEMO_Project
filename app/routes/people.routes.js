const People = require("../models/people.model.js");
const { fetchUser } = require("../middleware/fetchuser.js");


module.exports = (app) => {
  const { body, validationResult } = require("express-validator"); // API validation
  const router = require("express").Router();

  /*============= Fetch All Records of Peoples ============*/
  router.get("/", fetchUser, async (req, res) => {
    try {
      const pRecord = await People.getAllPeopleRecords();
      // console.log(`pRecord ----------> ${JSON.stringify(pRecord)}`);

      if (pRecord) {
        return res.status(200).send({ success: true, record: pRecord.rows });
      } else if (pRecord == null)
        return res
          .status(200)
          .json({ success: false, errors: "Data is Empty....!!!" });
      else
        return res
          .status(400)
          .json({ success: false, errors: "! Bad request" });
    } catch (error) {
      return res.status(500).send({ success: false, errors: error });
    }
  });
  
  /*========== Create New People record ==========*/
  router.post("/create", fetchUser, async (req, res) => {
    try {
      const pRecord = await People.createNewPeople(req.body);
      console.log(`created pRecord ----------> ${JSON.stringify(pRecord)}`);

      if (pRecord) {
        return res.status(201).send({ success : true , record: "Record created successfully..!!!" });
      } else
        return res
          .status(400)
          .json({ success: false, errors: "Record is Not created...!!!" });
    } catch (error) {
      return res.status(500).send({ success: false, errors: error });
    }
  });

  /*============ Update a specific people's records ===============*/
  router.put("/update/:id" , fetchUser, async (req,res) => {
    try {
        const pRecord = await People.updatePeopleRecord(req.body , req.params.id);
      console.log(`created pRecord ----------> ${JSON.stringify(pRecord)}`);

      if (pRecord) {
        return res.status(200).send({ success : true , record: "Record Updated successfully..!!!" });
      } else
        return res
          .status(400)
          .json({ success: false, errors: "Record is Not updated...!!!" });

    } catch (error) {
        return res.status(500).send({ success: false, errors: error });
    }
  })

  /*============ Delete a specific Record of Peolpe's =============*/
  router.delete("/delete/:id" , fetchUser , async (req , res) => {
    try {
        const pRecord = await People.deleteRecordById(req.params.id);
    //   console.log(`created pRecord ----------> ${JSON.stringify(pRecord)}`);

      if (pRecord) {
        return res.status(200).send({ success : true , message: "Record deleted successfully..!!!" });
      } else
        return res
          .status(400)
          .json({ success: false, message: "Record is Not Deleted...!!!" });
    } catch (error) {
        return res.status(500).send({ success: false, errors: error });
    }
  });

  app.use("/api/people", router);
};

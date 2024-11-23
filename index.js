import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

// Middleware to parse JSON request body
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const studentModel = mongoose.model("student", studentSchema);

app.get("/getStudent", async (req, res) => {
  const students = await studentModel.find();
  console.log("students", students);
  res.json(students);
});

// Bulk update
app.post("/saveStudents", async (req, res) => {
  console.log("Request body:", req.body);
  try {
    if (req.body?.length > 0) {
      const saveData = await studentModel.insertMany(req.body);
      res.status(201).json(saveData);
    } else {
      console.log("No Data found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

//single insert
app.post("/saveStudent", async (req, res) => {
  const { name, age } = req.body;
  const newStudent = new studentModel({
    name,
    age,
  });
  try {
    const saveStudent = newStudent.save();
    res.status(201).json(saveStudent);
  } catch (error) {
    throw new Error(error);
  }
});

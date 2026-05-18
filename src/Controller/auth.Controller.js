const UserModel = require("../Models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // npm i bcryptjs

const registerUser = async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  const isUserAlreadyExist = await UserModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10); // salt means adding random letter or number on hashed password.

  try {
    const user = await UserModel.create({
    username,
    email,
    password: hash,
    role,
    });
    const token = jwt.sign(
    {
        id: user._id,
        role: user.role,
    },
    process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    res.status(201).json({ message: "User registered successfully", user });
    console.log("User registered successfully", user);
  } catch (error) {
    res.status(400).json({ message: "Error occured" }, error);
  }
};


const loginUser = async (req, res)=>{

    const {username, email, password } = req.body

    try{

    const user = await UserModel.findOne({
        $or: [{username}, {email}]
    });

    if(!user){
    return res.status(401).json({message: "User not find", user});
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({message:"password doesn't match"})
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({message:"login successfully", 
        user})
}
catch(err){
    res.status(400).json({message:"error",error: err.message})
    console.log(err)
}
}

module.exports = { registerUser, loginUser };

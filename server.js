//Import Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

//Acutal Route
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//TODO => MAKE IT PRIVATE
//MongoURI
const mongoURI =
	"mongodb+srv://hari:harikanna@cluster0.gczxd.mongodb.net/LearningWidget?retryWrites=true&w=majority";

//Attempt to connect DB
mongoose
	.connect(mongoURI, {
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => console.log(`DB Connection Established`))
	.catch((error) => console.error(`Error in DB Connection`));

//Testing route
app.get("/", (req, res) => {
	res.send("API Endpoint for Learning Widget Application works fine.");
});

//actual route
app.use("/api", authRoute);
app.use("/api", profileRoute);

//PORT
const PORT = process.env.PORT || 5050;

//Server listens's to port
app.listen(PORT, () => console.log(`Server is Running in port ${PORT}`));

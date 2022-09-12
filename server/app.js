const express = require("express");
const app = express();
const dogRouter = require("./routes/dogs");
require("express-async-errors");

//load env vars in second way
// require("dotenv").config();

app.use(express.json());
app.use("/static", express.static("assets"));
// test env's implemented in 3 ways
console.log("API", process.env.API_KEY); //works
console.log(process.env.NODE_ENV); //works
//logger middleware

app.use((req, res, next) => {
	console.clear();
	console.log(`* A ${req.method} to: ${req.originalUrl}`);
	res.addListener("finish", (...rest) => {
		console.log("Status :" + res.statusCode);
	});
	next();
});

// Why do you not see the method and URL path logged to the terminal if you make a request to a static asset route?
//--------------answer---------------
// because it matches the route in the above middleware ans sends the respond before it reaches the logger middleware

app.use("/dogs", dogRouter);

// For te`sting purposes, GET /
app.get("/", (req, res) => {
	res.json(
		"Express server running. No content provided at root level. Please use another route."
	);
});

// For testing express.json middleware
app.post("/test-json", (req, res, next) => {
	// send the body as JSON with a Content-Type header of "application/json"
	// finishes the response, res.end()
	res.json(req.body);
	next();
});

// For testing express-async-errors
app.get("/test-error", async (req, res) => {
	throw new Error("Hello World!");
});

// -------------------End  of Routes
app.use("/*", (req, res, next) => {
	const err = new Error("Not Found !!");
	err.statusCode = 404;
	throw err;
});

// error handlers
app.use((err, req, res, next) => {
	console.log(err.message);
	res.status(err.statusCode || 500).json({
		Error: {
			message: err.message,
			statusCode: err.statusCode || 500,
			stack: err.stack,
		},
	});
});

const port = 5000;
app.listen(port, () => console.log("Server is listening on port", port));

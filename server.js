// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');
// const { fileURLToPath } = require('url');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// console.log(__dirname, '__dirname')

dotenv.config();

// Create a new express application called 'app'
const app = express();

// Set our backend port to be either an environment variable or port 5000
const port = process.env.PORT || 5000;

// This application level middleware prints incoming requests to the servers console
app.use((req, res, next) => {
  console.log(`Request_Endpoint: ${req.method} ${req.url}`);
  next();
});

app.use(fileUpload());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "'unsafe-inline'"],
      frameSrc: ["'self'", "'unsafe-inline'"],
      childSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'unsafe-inline'", "'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcElem: ["'self'", "'unsafe-inline'"],
      styleSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com/",
        "https://cdn.jsdelivr.net/",
      ],
      fontSrc: ["*", "'unsafe-inline'", "https://fonts.googleapis.com/"],
      imgSrc: [
        "*",
        "'self'",
        "'unsafe-inline'",
        "https://res.cloudinary.com",
        "https://stackpath.bootstrapcdn.com",
        "data/image",
        "data: *",
      ],
      baseUri: ["'self'", "'unsafe-inline'"],
    },
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

// Require Route
const api = require("./routes/routes.js");
// Configure app to use route
app.use("/api/v1/", api);

const options = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "React Node audio service",
      version: "1.0.0",
      contact: {
        name: "Oleh Kurtianyk",
        email: "o.kurtianyk@gmail.com",
      },
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "",
        description: "Staging server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// This middleware informs the express application to serve our compiled React files
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
  });
}

// Catch any bad requests
app.get("*", (req, res) => {
  res.status(200).json({
    msg: "This API endpoint doesn`t exist!",
  });
});

// Set our server to listen on the port defiend by our port variable
app.listen(port, () => console.log(`BACK_END_SERVICE_PORT: ${port}`));

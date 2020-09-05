var AuthenticationController = require("./controllers/authentication"),
  ProgramController = require("./controllers/programmes"),
  CenterController = require("./controllers/centers"),
  FranchiseController = require("./controllers/franchisees"),
  InstructorController = require("./controllers/instructors"),
  StudentController = require("./controllers/students"),
  NotificationController = require("./controllers/notifications"),
  PostOrderController = require("./controllers/post-order"),
  PriceMappingController = require("./controllers//price-mapping"),
  InventoryController = require("./controllers/inventory"),
  PassBookControler = require("./controllers/passbook"),
  OnlineController = require("./controllers/online"),
  ChatController = require("./controllers/chats"),
  express = require("express"),
  passportService = require("../config/passport"),
  passport = require("passport");

var requireAuth = passport.authenticate("jwt", { session: false }),
  requireLogin = passport.authenticate("local", { session: false });

module.exports = function(app) {
  app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST",
      "PUT",
      "DELETE",
      "HEAD",
      "OPTIONS"
    );
    next();
  });

  var apiRoutes = express.Router(),
    authRoutes = express.Router(),
    programRoutes = express.Router(),
    centerRoutes = express.Router(),
    franchiseRoutes = express.Router(),
    instructorRoutes = express.Router(),
    studentRoutes = express.Router(),
    notificationsRoutes = express.Router(),
    postOrderRoutes = express.Router(),
    priceMappingRoutes = express.Router(),
    inventoryRoutes = express.Router(),
    passbookRoutes = express.Router(),
    onlineRoutes = express.Router(),
    chatRoutes = express.Router();

  apiRoutes.use("/auth", authRoutes);
  authRoutes.post("/register", AuthenticationController.register);
  authRoutes.post("/update", AuthenticationController.update);
  authRoutes.post("/delete", AuthenticationController.delete);
  authRoutes.post("/login", requireLogin, AuthenticationController.login);
  authRoutes.post("/forgotPassword", AuthenticationController.forgotPassword);
  authRoutes.get("/usersList", AuthenticationController.getUsers);
  authRoutes.get("/protected", requireAuth, function(req, res) {
    console.log(req);
    res.send({ content: "Success" });
  });

  // Center Routes
  apiRoutes.use("/centers", centerRoutes);
  centerRoutes.get("/", CenterController.getCenters);
  centerRoutes.post("/", CenterController.createCenter);
  centerRoutes.put("/", CenterController.updateCenter);

  // Program Routes
  apiRoutes.use("/programmes", programRoutes);
  programRoutes.get("/", ProgramController.getProgrammes);
  programRoutes.post("/", ProgramController.createProgram);
  programRoutes.put("/", ProgramController.updateProgram);

  // Franchise Routes
  apiRoutes.use("/franchise", franchiseRoutes);
  franchiseRoutes.get("/", FranchiseController.getFranchisees);
  franchiseRoutes.post("/", FranchiseController.createFranchise);
  franchiseRoutes.put("/", FranchiseController.updateFranchise);

  // Instructor Routes
  apiRoutes.use("/instructor", instructorRoutes);
  instructorRoutes.get("/", InstructorController.getInstructors);
  instructorRoutes.post("/", InstructorController.createInstructor);
  instructorRoutes.put("/", InstructorController.updateInstructor);
  instructorRoutes.post("/printIdCard", InstructorController.printIdCard);

  // Student Routes
  apiRoutes.use("/students", studentRoutes);
  studentRoutes.get("/", StudentController.getStudent);
  studentRoutes.post("/sendFeeReceipt", StudentController.sendFeeReceipt);
  studentRoutes.post("/", StudentController.createStudent);
  studentRoutes.put("/", StudentController.updateStudent);
  studentRoutes.post(
    "/printStudentIdCard",
    StudentController.printStudentIdCard
  );

  // Notifications Routes
  apiRoutes.use("/notifications", notificationsRoutes);
  notificationsRoutes.get("/", NotificationController.getNotification);
  notificationsRoutes.post("/", NotificationController.createNotification);
  notificationsRoutes.put("/", NotificationController.updateNotification);

  // post-order Routes
  apiRoutes.use("/postorder", postOrderRoutes);
  postOrderRoutes.get("/", PostOrderController.getPostOrder);
  postOrderRoutes.post("/", PostOrderController.createPostOrder);
  postOrderRoutes.put("/", PostOrderController.updatePostOrder);

  // price-mapping Routes
  apiRoutes.use("/pricemapping", priceMappingRoutes);
  priceMappingRoutes.get("/", PriceMappingController.getPriceMapping);
  priceMappingRoutes.post("/", PriceMappingController.createPriceMapping);
  // priceMappingRoutes.put('/', PriceMappingController.updatePriceMapping);

  // inventoty routes
  apiRoutes.use("/inventory", inventoryRoutes);
  inventoryRoutes.get("/", InventoryController.getInventory);
  inventoryRoutes.post("/", InventoryController.createInventory);
  inventoryRoutes.put("/", InventoryController.updateInventory);

  // passbook routes
  apiRoutes.use("/passbook", passbookRoutes);
  passbookRoutes.get("/", PassBookControler.getPassBook);
  passbookRoutes.post("/", PassBookControler.createPassBook);
  passbookRoutes.put("/", PassBookControler.updatePassBook);

  // online routes
  apiRoutes.use("/online", onlineRoutes);
  onlineRoutes.get("/", OnlineController.getOnline);
  onlineRoutes.post("/", OnlineController.createOnline);
  onlineRoutes.put("/", OnlineController.updateOnline);
  onlineRoutes.post("/payments", OnlineController.payments);

  // Chat Routes
  apiRoutes.use("/chats", chatRoutes);
  chatRoutes.get("/list", ChatController.getChatListing);
  chatRoutes.get("/messages/:chatId/:userId", ChatController.getChatMessages);
  chatRoutes.put("/messages/:id", ChatController.updateChatMessage);
  chatRoutes.put("/:id", ChatController.updateChat);
  chatRoutes.post("/", ChatController.createChat);

  apiRoutes.get("/generateOTP/:phonenumber", OnlineController.generateOTP);
  apiRoutes.post("/uploadToS3", OnlineController.uploadToS3);

  // Set up routes
  app.use("/api", apiRoutes);
};
